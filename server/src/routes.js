const AuthenticationController = require('./controller/AuthenticationController');
const JoiPolicies = require('./controlPolicies/JoiPolicies');
const upload = require('./multer');




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
        AuthenticationController.authenticateToken, 
        AuthenticationController.changePassword);
    //about page
    app.get('/about', 
        AuthenticationController.authenticateToken,
        AuthenticationController.about
    );
    //profile page
    app.post('/profile', 
        AuthenticationController.authenticateToken,
        //upload image middleware
        upload.single('image'),
        AuthenticationController.profile
    );
    app.post('/comparePassword', 
        AuthenticationController.comparePassword
    );
    //Retrieve user profile API
    app.get('/api/profile', 
        AuthenticationController.authenticateToken,
        AuthenticationController.userProfileInformation
    );
    //Write user location into DB
    app.post('/api/writeLocation', 
        AuthenticationController.authenticateToken,
        AuthenticationController.writeLocation
    );
    //get nearby users
    app.post('/api/getNearbyUsers', 
        AuthenticationController.authenticateToken,
        AuthenticationController.getNearbyUsers
    );
}