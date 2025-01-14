const  userModel = require('./models/users');
const { sequelize, Sequelize } = require('./db/dbConfig');

const User = userModel(sequelize, Sequelize.DataTypes);


module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send({ message:'Server is running...'});
    });
    
    app.post('/register', async (req, res) => {
        //receive post request data from front
        console.log('register data =>', req.body);
        //send response back to front
        res.send({ message:`${req.body.email} Your registration was Success!` });
        try{
            const fei = User.create({
                        email: req.body.email,
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword
                    });
                    fei;
            console.log('User register in DB success!');
        } catch (err) {
            console.log('User register in DB failed!');
            console.log(err)
        }
        
    });
    
    app.post('/login', async (req,res)=>{
        console.log('login data =>', req.body);
        //receive login post request data from login page
        const userName = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        const usePassword = await User.findOne({
            where: {
                password: req.body.password
            }
        })
       
        if(!userName){
            console.log('User not found');
            return res.status(404).send({message: `User ${req.body.email} not found!`});
        }
        if(!usePassword){
            console.log('User password is incorrect!');
            return res.status(404).send({message: `User password is incorrect!`});
        }
        res.status(200).send({ message:`${req.body.email} Your login was Success!` });
    })
}