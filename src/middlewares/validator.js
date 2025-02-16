import { body } from "express-validator"
import { validateFields } from "./validate-fields.js"
import { existentEmail, isValidRole } from "../helpers/db-validator.js"

export const registerValidatorTeacher = [
    body("name", "The name is required").not().isEmpty(),
    body("surname", "The surname is required").not().isEmpty(),
    body("email", "You must to enter a valid email").isEmail(),
    body("email").custom(existentEmail),
    body("role").custom(isValidRole),
    body("password", "Password must be at leaste 8 characters.").isLength({min:8}),
    validateFields
]

export const registerValidatorStudent = [
    body("name", "The name is required").not().isEmpty(),
    body("surname", "The surname is required").not().isEmpty(),
    body("email", "You must to enter a valid email").isEmail(),
    body("email").custom(existentEmail),
    body("password", "Password must be at leaste 8 characters.").isLength({min:8}),
    validateFields
]

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address."),
    body("username").optional().isString().withMessage("Enter a valid username."),
    body("password", "Password must be at leaste 8 characters.").isLength({min:8}),
    validateFields
] 