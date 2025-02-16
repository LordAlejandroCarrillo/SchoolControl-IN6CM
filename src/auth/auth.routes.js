import { Router } from "express"
import { registerTeacher, registerStudent, login } from "./auth.controller.js"
import { registerValidatorStudent, registerValidatorTeacher , loginValidator,  } from "../middlewares/validator.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()

router.post(
    '/register/student',
    registerValidatorStudent,
    deleteFileOnError,
    registerStudent
)

router.post(
    '/register/teacher',
    registerValidatorTeacher,
    deleteFileOnError,
    registerTeacher
)

router.post(
    '/login/',
    loginValidator,
    deleteFileOnError,
    login
)

export default router