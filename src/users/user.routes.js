import { Router } from "express"
import { check } from "express-validator"
import { getUsers, assingSubject, getStudentSubjects, deleteUser, updateUser } from "./user.controller.js"
import { subjectExistById } from "../helpers/db-validator.js"
import {validateFields} from "../middlewares/validate-fields.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { userExistsById } from "../helpers/db-validator.js"

const router = Router()

router.get("/", getUsers)

router.get("/own-subjects", getStudentSubjects)

router.put(
    "/assign-subject/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(subjectExistById),
        deleteFileOnError
    ],
    assingSubject
)

router.put(
    "/update-user/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(userExistsById),
        validateFields,
        deleteFileOnError
    ],
    updateUser
)

router.delete(
    "/delete-user/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(userExistsById),
        validateFields,
        deleteFileOnError
    ],
    deleteUser
)


export default router