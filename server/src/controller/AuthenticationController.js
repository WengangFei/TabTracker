const userModel = require('../models/users');
const { sequelize, Sequelize } = require('../db/dbConfig');
const User = userModel(sequelize, Sequelize.DataTypes);
const bcrypt = require('bcryptjs');



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
        res.status(200).send({ 
            message:`Your login as ${req.body.email} was Success!`,
            loginInfo: userName.toJSON(),       
        });
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
    }
    

}