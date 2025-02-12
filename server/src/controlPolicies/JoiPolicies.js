const Joi = require('joi');

//server side validate data tt sent from client side before hit the final controller
module.exports = {
    register (req, res, next) {
        console.log('req body =>', req.body);
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().min(6).required(),
            lat: Joi.number().optional(),
            lng: Joi.number().optional(),
            actualAddress: Joi.string().allow(''),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('Joi policies failed......');
            console.log(error.details); 
            return res.status(400).send({ message: error.details[0].message });
        }
        console.log('Joi policies passed......');
        next();
    },
    login (req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('Joi policies failed......');
            return res.status(400).send({ message: error.details[0].message });
        }
        console.log('Joi policies passed......');
        next();
    },
    profile (req, res, next) {
        const schema = Joi.object({
            name: Joi.string().required(),
            age: Joi.number().required(),
            location: Joi.string().required(),
            introduction: Joi.string().required(),
            image: Joi.object({
                fieldname: Joi.string().valid('image').required(),
                originalname: Joi.string().pattern(/\.(jpg|jpeg|png|gif)$/).required(), // Allows specific image formats
                mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(), // Ensures the MIME type is correct
                size: Joi.number().max(5 * 1024 * 1024).required(), // Limits file size to 5MB
            }).required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('Joi policies failed......');
            return res.status(400).send({ message: error.details[0].message });
        }
        console.log('Joi policies passed......');
        next();
    }
}