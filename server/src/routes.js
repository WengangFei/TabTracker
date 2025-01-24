const AuthenticationController = require('./controller/AuthenticationController');
const JoiPolicies = require('./controlPolicies/JoiPolicies');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send({ message:'Server is running...'});
    });
    // user register
    app.post(
        '/register', 
        //Joi middleware function before hit the final controller
        JoiPolicies.register, 
        AuthenticationController.register
    );
    //user login
    app.post(
        '/login',
        JoiPolicies.login,
        AuthenticationController.login);
    //change password
    app.post('/setting', AuthenticationController.changePassword);
}