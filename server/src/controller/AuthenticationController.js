const userModel = require('../models/users');
const dogModel = require('../models/dogs');
const eventModel = require('../models/events');
const { sequelize, Sequelize } = require('../db/dbConfig');
const User = userModel(sequelize, Sequelize.DataTypes);
const Dog = dogModel(sequelize, Sequelize.DataTypes);
const Event = eventModel(sequelize, Sequelize.DataTypes);
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
            // console.log('jwt user decoded ==>:', user);
            if (err) {
                // Token is invalid
                return res.status(403).json({ message: 'Forbidden', error: err.message });
            }
            // Successful token verification
            req.user = user;  // Attach user information to the request object
            // console.log('jwt decoded:', req.user);
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
    authenticateToken,
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
                return res.status(404).send({message: `Email ${req.body.email} not exist. Please register an Account!`});
            }
            //check if password is match the password in DB
            const usePassword = await bcrypt.compare(req.body.password, userName.password);

            if(!usePassword){
                console.log('User password is incorrect!');
                return res.status(404).send({message: `User password is incorrect!`});
            }
            // console.log('User login info =>',userName.toJSON());
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
            console.log('User login failed!'+ err);
            return res.status(500).send({message: "Email not exist, please register an account!"});
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
    //write user profile
    async writeUserProfile(req, res) {
        try{
            const updateData = {};
            // Check each field in req.body and only add non-null and non-empty string values
            if (req.body.name && req.body.name.trim()) {
                updateData.name = req.body.name;
            }
            if (req.body.age && req.body.age.trim()) {
                updateData.age = req.body.age;
            }
            if (req.body.location && req.body.location.trim()) {
                updateData.location = req.body.location;
            }
            if (req.body.introduction && req.body.introduction.trim()) {
                updateData.introduction = req.body.introduction;
            }
            if (req.body.contact && req.body.contact.trim()) {
                updateData.contact = req.body.contact;
            }
            if (req.body.newPassword && req.body.newPassword.trim()) {
                updateData.newPassword = req.body.newPassword;
            }
            if (req.body.confirmPassword && req.body.confirmPassword.trim()) {
                updateData.confirmPassword = req.body.confirmPassword;
            }
            // Check if a file was uploaded and include it in the update data
            if (req.file && req.file.path) {
                updateData.image = req.file.path;
            }
            console.log('Update data =>', req.file);
            // console.log('Write user profile information =>', req.body);
            const wroteProfileIntoDB = await User.update( updateData,
            {
                where: { email: req.user.email },
                //show the instances of updated rows
                returning: true,
            });
            console.log('User profile updated successfully!');
            return res.status(200).send({ 
                message: 'Profile updated successfully!',
                wroteUserProfileIntoDB : wroteProfileIntoDB[1][0],
            });
        }
        catch(error){
                console.error('Error updating profile:', error);
                return res.status(500).send({ message: 'Server error. Please try again later.' });
                }
    },
    //retrieve puppies profiles
    async retrieveUserPuppiesProfileInformation(req, res) {
        try{
            const puppiesProfileInformation = await Dog.findAll({
                where: {
                    ownerId: req.user.id
                },
                order: [['updatedAt', 'DESC']]
            });
            console.log('Puppies profile information successfully retrieved =>',puppiesProfileInformation.length);
            return res.status(200).send({
                message: `Puppies profile information retrieved successfully!`,
                puppiesProfileInformation,
            });
        }
        catch(err){
            console.log('Puppies profile information failed to retrieve!');
            return res.status(500).send({message: `Puppies profile information failed! ${err}`});
        }
    },
    //retrieve single puppy profile
    async retrieveSinglePuppiesProfileInformation(req, res) {
        try{
            const singlePuppyProfileInfo = await Dog.findOne({
                where: {
                    id: req.params.id
                }
            });
            // console.log('Single puppies profile information successfully retrieved =>',singlePuppyProfileInfo.get());
            return res.status(200).send({
                message: `Single puppies profile information retrieved successfully!`,
                singlePuppyProfileInfo,
            });
        }
        catch(err){
            console.log('Single puppy profile information failed to retrieve!');
            return res.status(500).send({message: `Single puppy profile information failed! ${err}`});
        }
    },
    async createPuppiesProfile (req, res) {
        try{
            const { name, age, size, type, introduction } = req.body;
            const imagePath = req.file ? req.file.path : undefined; 
            console.log('create a puppy profile...');
            // Save profile information to the database
            const puppyProfile = await Dog.create({
                ownerId: req.user.id,
                name,
                age,
                size,
                type,
                introduction,
                image:imagePath
            });
            console.log('User profile created successfully!');
            return res.status(200).send({
                message: `User profile created successfully!`,
                puppyProfile,
            }); 
        }catch(err){
            console.log('Puppy profile failed to created!');
            return res.status(500).send({message: `Puppy profile failed to created! ${err}`});
        }
    },
    //update a single puppy profile
    async updateSinglePuppyProfile(req, res) {
        const { name, age, size, type, introduction } = req.body;
        const imagePath = req.file ? req.file.path : undefined;
        console.log('single puppy profile information =>', req.body);
        try{
            console.log('updating single puppy profile....');
            if(imagePath){
                    // Update profile information in the database
                const puppyProfile = await Dog.update({
                    name,
                    age,
                    size,
                    type,
                    introduction,
                    image:imagePath
                },
                {
                    where: { id: req.body.puppyId },
                    //show the instances of updated rows
                    returning: true,
                });
                console.log('Puppy profile updated successfully!');
                return res.status(200).send({
                    message: `Puppy profile updated successfully!`,
                    puppyProfile: puppyProfile[1][0],
                });
            }
            else{
                // Update profile information in the database without updating image
                const puppyProfile = await Dog.update({
                    name,
                    age,
                    size,
                    type,
                    introduction,
                },
                {
                    where: { id: req.body.puppyId },
                    //show the instances of updated rows
                    returning: true,
                });
                console.log('Puppy profile updated without updating image successfully!');
                return res.status(200).send({
                    message: `Puppy profile updated without updating image successfully!`,
                    puppyProfile: puppyProfile[1][0],
                });
            }
            
        }catch(err){
            console.log('Could not find puppy profile!', err.message);
            return res.status(500).send({message: `Puppy profile failed to find! ${err}`});
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
    //API for frontend retrieve user profile from database
    async retrieveUserProfileInformation(req, res) {
        try{
            const userProfileInformation = await User.findOne({
                where: {
                    id: req.user.id
                }
            });
            // console.log('User profile information successfully retrieved =>',userProfileInformation.get());
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
            // console.log('Write location information =>', req.body);
            // console.log('User id =>', req.user);
            const wroteAddressIntoDB = await User.update({
                actualAddress: req.body.actualAddress,
                lat: req.body.lat,
                lng: req.body.lng,
            },
            {
                where: { email: req.body.loginUserEmail },
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
    //get nearby users return as an array for collectNearbyUsersProfile api
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
            // console.log('nearby users =>',nearbyUsers.length);
            if(nearbyUsers.length !== 0){
                const filteredNearbyUsers = nearbyUsers.filter(user => user.email !== req.user.email).map(user => user.get().id);
                // console.log('filteredNearbyUsers =>',filteredNearbyUsers);
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
    //home location window auto collect nearby users profile return as an array
    async collectNearbyUsersProfile(req, res) {
        try{
            const { nearbyUsersArray } = req.body;
            const collectNearbyUsersProfile = await Dog.findAll({
                where: {
                    ownerId: {
                        [Op.in]: nearbyUsersArray
                    }
                }
            });
            console.log('Nearby users =>',collectNearbyUsersProfile.length);
            return res.status(200).send({
                message: 'Nearby users profile retrieved successfully!',
                collectNearbyUsersProfile,
            });
            
        }catch(error){ 
            console.log('Can not collect nearby users profile!' + error.message);
            return res.status(500).send({message: `collect nearby users profile failed!`});
        }
    },
    //collect searched users return as an array
    async collectSearchUsers(req, res) {
        try {
            console.log('serach user =>',req.query);
            console.log('use=>',req.user);
            const { name } = req.query;
            const users = await Dog.findAll({
              where: {
                name: {
                    // Case-insensitive search for name containing 'john'
                    [Op.iLike]: `%${name}%` 
                },
                //Exclude current user
                ownerId: {
                    [Op.ne]: req.user.id
                }
              }
            });
            console.log('users =>',users.length);
            // Log the results (you can return or process the data further)
            console.log(users.map(user => user.name));
            if(users){
                return res.status(200).send({
                    message: 'Search users profile retrieved successfully!',
                    users,
                })
            }else{
                console.log('Does not have search users in DB!');
            }
            
        } catch (error) {
        console.error('Error retrieving users:', error);
        }
    }, 
    //search single user
    async searchSingleUser(req, res) {  
        try{console.log('search single user information =>', req.body);
            const { id } = req.body;
            const singleUser = await User.findOne({
                where: {
                    id: id
                }
            });
            console.log('Single user =>',singleUser.get());
            return res.status(200).send({
                message: 'Single user profile retrieved successfully!',
                singleUser,
            }); 
        }catch(error){
            console.log('Can not search single user!' + error.message);
            return res.status(500).send({message: `search single user failed!`});
        }
    },
    //create an event
    async createEvent(req, res) {
        try{
            console.log('create event =>', req.body);
            const createdEvent = await Event.create({
                ownerId: req.user.id,
                eventName: req.body.eventName,
                creator: req.body.creator,
                description: req.body.description,
                location: req.body.location,
                date: req.body.date,
                contact: req.body.contact,
                agreeTerms: req.body.agreeTerms,
            });
            console.log('Event created successfully!');
            return res.status(200).send({
                message: 'Event created successfully!',
                createdEvent,
            });
        }catch(error){
            console.log('Can not create an event!' + error.message);
            return res.status(500).send({message: `create an event failed!`});
        }
    }

}