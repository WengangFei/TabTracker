const userModel = require('../models/users');
const dogModel = require('../models/dogs');
const { sequelize, Sequelize } = require('../db/dbConfig');
const User = userModel(sequelize, Sequelize.DataTypes);
const Dog = dogModel(sequelize, Sequelize.DataTypes);
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
                            confirmPassword: req.body.confirmPassword
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
        // req.file => {
        //     fieldname: 'image',
        //     originalname: '169cf9eb74fb4f5b.jpg',
        //     encoding: '7bit',
        //     mimetype: 'image/jpeg',
        //     destination: '/Users/wenfei/Vue/TabTracker/server/src/uploads/',
        //     filename: '1738342259867-169cf9eb74fb4f5b.jpg',
        //     path: '/Users/wenfei/Vue/TabTracker/server/src/uploads/1738342259867-169cf9eb74fb4f5b.jpg',
        //     size: 3707
        //   }
        try{
          
            const { name, age, location, introduction } = req.body;
            const imagePath = req.file ? req.file.path : undefined;  
            if(!imagePath){
                console.log('Profile image failed to uploaded!');
                return res.status(400).send({message: `User profile image failed to uploaded!`});
            }
            try{
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

            }catch(err){
                console.log('User profile failed to created!');
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
    authenticateToken,

}