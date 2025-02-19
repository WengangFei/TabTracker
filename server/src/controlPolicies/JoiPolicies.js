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
            console.log('Joi policies failed......',error.details[0].message);
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
            console.log('Joi policies failed......',error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }
        console.log('Joi policies passed......');
        next();
    },
    writeUserProfile (req, res, next) {
        const schema = Joi.object({
            name: Joi.string().min(3).allow('').optional(),  // Allows empty or a valid string
            age: Joi.number().min(1).allow('').optional(),  // Allows empty or a valid number
            contact: Joi.string().min(6).allow('').optional(),  // Allows empty or a valid string
            newPassword: Joi.string().min(6).allow('').optional(),  // Allows empty or a valid string with min length of 6
            confirmPassword: Joi.string().min(6).allow('').optional(),  // Same as above for confirmPassword
            location: Joi.string().min(1).allow('').optional(),  // Allows empty or a valid string
            introduction: Joi.string().min(1).allow('').optional(),  // Allows empty or a valid string
            image: Joi.object({
                fieldname: Joi.string().valid('image').allow('').optional(),  // Allows empty or a valid string 'image'
                originalname: Joi.string().pattern(/\.(jpg|jpeg|png|gif)$/).allow('').optional(),  // Allows empty or a valid image format
                mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').allow('').optional(),  // Allows empty or a valid MIME type
                size: Joi.number().max(5 * 1024 * 1024).allow('').optional(),  // Allows empty or a valid number for size, with max size 5MB
            }).allow('').optional()  // Allows empty or a valid object for image
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('Joi policies failed......',error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }
        console.log('user profile Joi policies passed......');
        next();
    },
    createEvent (req, res, next) {
        const schema = Joi.object({
            eventName: Joi.string().required(),
            creator: Joi.string().required(),
            contact: Joi.string().required(),
            date: Joi.date().required(),
            description: Joi.string().optional(),
            location: Joi.string().optional(),
            agreeTerms: Joi.boolean().optional(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('Joi policies failed......',error.details[0].message);
            console.log(error.details);
            return res.status(400).send({ message: error.details[0].message });
        }
        console.log('Joi policies passed......');
        next();
    }
}