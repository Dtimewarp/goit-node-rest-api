import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
})

export const updateContactSchema = Joi.object({

    name: Joi.string().min(1).max(255),
    email: Joi.string().email().max(255),
    phone: Joi.string().pattern(/^\+?\d{0,3}(\s|-)?\d{3}(\s|-)?\d{2}(\s|-)?\d{2}$/),
});

function validateContactUpdate(data) {
    return updateContactSchema.validate(data, { abortEarly: false });
}

export { validateContactUpdate };