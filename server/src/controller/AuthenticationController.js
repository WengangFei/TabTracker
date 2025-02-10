const userModel = require('../models/users');
const dogModel = require('../models/dogs');
const { sequelize, Sequelize } = require('../db/dbConfig');
const User = userModel(sequelize, Sequelize.DataTypes);
const Dog = dogModel(sequelize, Sequelize.DataTypes);
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
//JWT middleware
const jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
// Authenticate token
const authenticateToken = async (req, res, next) => {
    try {
        // Extract authorization header and token
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        // Check if token exists
        if (!token) {
            console.log('No token provided!');
            return res.status(401).json({ message: 'No token provided!' });
        }

        // Verify the token
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                // Token is invalid
                return res.status(403).json({ message: 'Forbidden', error: err.message });
            }

            // Successful token verification
            req.user = user;  // Attach user information to the request object
            console.log('jwt decoded:', req.user);
            console.log('User authenticated successfully.');

            // Proceed to the next middleware/route handler
            next();
        });
    } catch (err) {
        // General error handling for unexpected issues
        console.error('Error during token authentication:', err);
        return res.status(500).json({ message: `Token authentication failed: ${err.message}` });
    }
};




module.exports = {
    async register (req, res){
        //receive post request data from front
        console.log('register data =>', req.body);
        //check if email exist in DB
        const emailExist = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if(emailExist){
            console.log('Email already exist!');
            return res.status(409).send({message: `Email ${req.body.email} already exist!`});
        }
        else{
            try{
                const registeredUser = await User.create({
                    email: req.body.email,
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword,
                    lat: req.body.lat,
                    lng: req.body.lng,
                    actualAddress: req.body.actualAddress
                });
                console.log('User register in DB success!');
                //send response back to front
                return res.status(200).send({ 
                    message:`${req.body.email} Your registration was Success!` ,
                    registeredInfo: registeredUser.toJSON(),
                });
            } catch (err) {
                console.log('User register in DB failed!');
                return res.status(500).send({message: `User register in DB failed! ${err}`});
            }
        }
    },

    async login (req,res){
        try{
            console.log('Login information =>', req.body);                                          
            //receive login post request data from login page
            const userName = await User.scope('withPassword').findOne({
                where: {
                    email: req.body.email
                }
            });    
        
            if(!userName){
                console.log('User not found!');
                return res.status(404).send({message: `User ${req.body.email} not found!`});
            }
            //check if password is match the password in DB
            const usePassword = await bcrypt.compare(req.body.password, userName.password);

            if(!usePassword){
                console.log('User password is incorrect!');
                return res.status(404).send({message: `User password is incorrect!`});
            }
            console.log('User login info =>',userName.toJSON());
            //create JWT token when user login
            const token = jwt.sign(
                { id: userName.id, email: userName.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            )
            return res.status(200).send({ 
                message:`Your login as ${req.body.email} was Success!`,
                loginInfo: userName.toJSON(), 
                token      
            });
        }
        catch(err){
            console.log('User login failed!');
            return res.status(500).send({message: `User login failed! ${err}`});
        }
    },

    async changePassword(req, res) {
        try {
            console.log('Change password information =>', req.body);
    
            const { password, currentEmail } = req.body;
            // Find user by email
            const findUser = await User.findOne({
                where: { email: currentEmail },
            });
            
            if (!findUser) {
                console.log('No user found.');
                return res.status(404).send({ message: 'User not found.' });
            }
    
            // Update password in the database
            const updatedUser = await User.update(
                {
                    password: bcrypt.hashSync(password, 10),
                    confirmPassword: bcrypt.hashSync(password, 10),
                },
                {
                    where: { email: currentEmail },
                    //show the instances of updated rows
                    returning: true,
                }
            );
   
            // Check if password update was successful
            if (updatedUser[0] > 0) {  
                // updatedUser[0] contains the number of affected rows, return updatedUser => [1]
                console.log('User password updated successfully!');
                return res.status(200).send({
                    message: 'Your password was updated successfully!',
                });
            } else {
                console.log('User password update failed!');
                return res.status(500).send({
                    message: 'User password update failed!',
                });
            }
    
        } catch (error) {
            console.error('Error updating password:', error);
            return res.status(500).send({ message: 'Server error. Please try again later.' });
        }
    },

    async profile(req, res) {
        try{
            const { name, age, location, introduction } = req.body;
            const imagePath = req.file ? req.file.path : undefined;  
            // console.log('create profile information =>', req.user);
            try{
                const dogProfile = await Dog.findOne({
                    where: {
                        ownerId: req.user.id
                    }
                })
                if(dogProfile){
                    if(imagePath){
                         // Update profile information in the database
                        const puppyProfile = await Dog.update({
                            name,
                            age,
                            location,
                            introduction,
                            image:imagePath
                        },
                        {
                            where: { ownerId: req.user.id },
                            //show the instances of updated rows
                            returning: true,
                        });
                        console.log('User profile updated successfully!');
                        return res.status(200).send({
                            message: `User profile updated successfully!`,
                            puppyProfile: puppyProfile[1][0],
                        });
                    }
                    else{
                        // Update profile information in the database without updating image
                        const puppyProfile = await Dog.update({
                            name,
                            age,
                            location,
                            introduction,
                        },
                        {
                            where: { ownerId: req.user.id },
                            //show the instances of updated rows
                            returning: true,
                        });
                        console.log('User profile updated without updating image successfully!');
                        return res.status(200).send({
                            message: `User profile updated without updating image successfully!`,
                            puppyProfile: puppyProfile[1][0],
                        });
                    }
                }
                else{console.log('User profile send info! =>', req.body);
                    // Save profile information to the database
                    const puppyProfile = await Dog.create({
                        ownerId: req.user.id,
                        name,
                        age,
                        location,
                        introduction,
                        image:imagePath
                    });
                    console.log('User profile created successfully!');
                    return res.status(200).send({
                        message: `User profile created successfully!`,
                        puppyProfile,
                    });
                }
            }catch(err){
                console.log('User profile failed to created!', err.message);
                return res.status(500).send({message: `User profile failed! ${err}`});
            }
    
        }catch(err){
            console.log('User profile failed to uploaded!');
            return res.status(500).send({message: `User profile failed! ${err}`});
        }
    },
    async comparePassword(req, res) {
        try{
            console.log('Compare password information =>', req.body); 
            const { currentEmail, password } = req.body;
            // Find user by email
            const findUser = await User.scope('withPassword').findOne({
                where: { email: currentEmail },
            });
            //check if password is match the password in DB
            const usePassword = await bcrypt.compare(password, findUser.password);
            if(!usePassword){
                console.log('User password is incorrect!');
                return res.status(401).send({message: `User password is incorrect!`});
            }
           
            console.log('User password is correct!');
            return res.status(200).send({message: `User password is correct!`});
            
        }
        catch(err){
            console.log('User login failed!');
            return res.status(500).send({message: `User login failed! ${err}`});
        }
    },
    
    async home(req, res) {
        console.log('User visited home page!');
        res.status(200).send({ message: 'Welcome to the home page!' }); 
    },

    async about(req, res) {
        res.status(200).send({ message: 'Welcome to the about page!' }); 
    },
    //API for frontend retrieve data from database
    async userProfileInformation(req, res) {
        console.log('Retrieving user profile information...');
        try{
            const userProfileInformation = await Dog.findOne({
                where: {
                    ownerId: req.user.id
                }
            });
            //add email to userProfileInformation for frontend
            userProfileInformation.dataValues.email = req.user.email;
            return res.status(200).send({
                message: `User profile information retrieved successfully!`,
                userProfileInformation,
            });
        }
        catch(err){
            console.log('User profile information failed to retrieve!');
            return res.status(500).send({message: `User profile information failed! ${err}`});
        }
    },
    //write user location into DB api
    async writeLocation(req, res) {
        try{
            console.log('Write location information =>', req.body);
            console.log('User id =>', req.user.email);
            const wroteAddressIntoDB = await User.update({
                actualAddress: req.body.actualAddress,
                lat: req.body.lat,
                lng: req.body.lng,
            },
            {
                where: { email: req.user.email },
                //show the instances of updated rows
                returning: true,
            });
            return res.status(200).send({ 
                message: 'Location updated successfully!',
                wroteAddressIntoDB : wroteAddressIntoDB[1][0],
            });
        }
        catch(error){
            console.log('Error updating location:', error);
            return res.status(500).send({ 
                message: 'Server error. Can not write location into DB.'
            });
        }
    },
    async getNearbyUsers(req, res) {
        try{
            const { maxLat,minLat,maxLng,minLng } = req.body;
            const nearbyUsers = await User.findAll({
                where: {
                    lat:{
                        [Op.between]:[minLat,maxLat],
                    },
                    lng:{
                        [Op.between]:[minLng,maxLng],   
                    }
                },
            });
            console.log('nearby users =>',nearbyUsers.length);
            if(nearbyUsers.length !== 0){
                const filteredNearbyUsers = nearbyUsers.filter(user => user.email !== req.user.email).map(user => user.get().id);
                console.log('filteredNearbyUsers =>',filteredNearbyUsers);
                return res.status(200).send({
                    message: 'Nearby users retrieved successfully!',
                    nearbyUsers: filteredNearbyUsers,
                })
            }else{
                console.log('Does not have nearby users in DB!');
            }
            return res.status(200).send({
                message: 'Nearby users retrieved successfully!',
                nearbyUsers,
            });
        }catch{
            console.log('Can not get lat and lng from frontend to retrieve nearby users in DB!');
            return res.status(500).send({message: `get nearby users failed!`});
        }
        
    },


    authenticateToken,

}