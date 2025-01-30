const AuthenticationController = require('./controller/AuthenticationController');
const JoiPolicies = require('./controlPolicies/JoiPolicies');




module.exports = (app) => {
    //home page
    app.get('/home', 
        AuthenticationController.authenticateToken,
        AuthenticationController.home
    );
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
    app.post('/setting', 
        AuthenticationController.authenticateToken, AuthenticationController.changePassword);
    //about page
    app.get('/about', 
        AuthenticationController.authenticateToken,
        AuthenticationController.about
    );
}