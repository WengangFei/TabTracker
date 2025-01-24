const Joi = require('joi');
//server side validate data tt sent from client side before hit the final controller
module.exports = {
    register (req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().min(6).required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log('Joi policies failed......');
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
}