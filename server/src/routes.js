const AuthenticationController = require('./controller/AuthenticationController');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send({ message:'Server is running...'});
    });
    // user register
    app.post('/register', AuthenticationController.register);
    //user login
    app.post('/login', AuthenticationController.login);
    //change password
    app.post('/setting', AuthenticationController.changePassword);
}