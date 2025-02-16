import { Router } from "express"
import { check } from "express-validator"
import { addSubject, editSubjectById, deleteSubject, getSubjects} from "./subject.controller.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { subjectExistById } from "../helpers/db-validator.js"
import {validateFields} from "../middlewares/validate-fields.js"
const router = Router()

router.get('/getSubjects', getSubjects)

router.post(
    '/',
    deleteFileOnError,
    addSubject
)

router.put(
    "/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(subjectExistById),
        validateFields,
        deleteFileOnError
    ],
    editSubjectById
)

router.delete(
    "/:id",
    [
        check("id", "Is not a valid ID").isMongoId(),
        check("id").custom(subjectExistById),
        validateFields
    ],
    deleteSubject
)


export default router