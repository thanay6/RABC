import Joi from "joi";

// Define validation schema
export const todoValidationSchema = Joi.object({
  description: Joi.string().min(3).required().messages({
    "string.base": "Description should be a type of text",
    "string.empty": "Description cannot be empty",
    "string.min": "Description should have a minimum length of {#limit}",
    "any.required": "Description is a required field",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is a required field",
    }),
  title: Joi.string().min(1).required().messages({
    "string.base": "Title should be a type of text",
    "string.empty": "Title cannot be empty",
    "string.min": "Title should have a minimum length of {#limit}",
    "any.required": "Title is a required field",
  }),
  providerId: Joi.number().integer().required().messages({
    "number.base": "Provider ID should be a number",
    "any.required": "Provider ID is a required field",
  }),
});
