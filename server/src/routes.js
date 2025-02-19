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
    app.post('/puppies', 
        AuthenticationController.authenticateToken,
        //upload image middleware
        upload.single('image'),
        AuthenticationController.puppies
    );
    app.post('/comparePassword', 
        AuthenticationController.comparePassword
    );
    //write user profile
    app.post('/api/write_user_profile', 
        AuthenticationController.authenticateToken, 
        JoiPolicies.writeUserProfile,
        //upload image middleware
        upload.single('image'),
        AuthenticationController.writeUserProfile,
    );
    //Retrieve user profile API
    app.get('/api/retrieve_user_profile', 
        AuthenticationController.authenticateToken,
        AuthenticationController.retrieveUserProfileInformation
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
    //collect nearby users profile
    app.post('/api/collectNearbyUsersProfile', 
        AuthenticationController.authenticateToken,
        AuthenticationController.collectNearbyUsersProfile
    );
    //manually search users
    app.get('/api/searchUsers', 
        AuthenticationController.authenticateToken,
        AuthenticationController.collectSearchUsers
    );
    //search single user
    app.post('/api/searchSingleUser', 
        AuthenticationController.authenticateToken,
        AuthenticationController.searchSingleUser
    );
    //create event
    app.post('/api/createEvent', 
        AuthenticationController.authenticateToken,
        JoiPolicies.createEvent,
        AuthenticationController.createEvent
    );
}