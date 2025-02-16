import Role from "../role/role.model.js"
import User from "../users/user.model.js"
import Subject from "../subject/subject.model.js"

export const isValidRole = async (role = '') => {
    const rolExists = await Role.findOne({ role })

    if(!rolExists){
        throw new Error(`El rol ${ role } no existe en la base de datos`)
    }
}

export const existentEmail = async (email = ' ') => {
    
    const existEmail = await User.findOne({email})
    
    if(existEmail){
        throw new Error(`El correo ${ email } ya existe en la base de datos`)
    }
}

export const userExistsById = async(id = "") => {
    const userExists = await User.findById(id)

    if(!userExists){
        throw new Error(`The ID ${id} doesn't exist`)
    }
}

export const subjectExistById = async(id = "") => {
    const subjectExists = await Subject.findById(id)

    if(!subjectExists){
        throw new Error(`The ID ${id} doesn't exist`)
    }
}