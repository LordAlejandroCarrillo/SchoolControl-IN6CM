import { response, request } from "express"
import User from "./user.model.js"
import jwt from "jsonwebtoken"
import Subject from "../subject/subject.model.js"

export const getUsers = async  (req = request, res = response) => {
    try {
        const {limit = 10, since = 0} = req.query
        const query = {state : true}

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(since))
                .limit(Number(limit))
        ])
        
        res.status(200).json({
            succes: true,
            total,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error obtaining users',
            error
        })
    }
}

export const assingSubject = async (req = request, res = response)=>{
    try {
        const query = {state : true}
        const [total, subjects] = await Promise.all([
            Subject.countDocuments(query),
            Subject.find(query)
        ])
        const [totalUsr, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])
        
        const token = req.header('x-token')
        
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const { id } = req.params
        let verify = true
        let grant = true
        let onlyOneAssign = true
        let verifyLength = true
        subjects.map( async localSubject =>{
            if(localSubject.id == id){
                    if(localSubject.state != false){
                        users.map(async user => {
                            if(user.id == uid){
                                if(user.role != 'TEACHER_ROLE'){
                                    let count = 0
                                    user.subjects.map( subjectUser =>{
                                        console.log(subjectUser)
                                        if(subjectUser._id.toString() == id){
                                            count++
                                        }
                                    })
                                    let subjectLenght = user.subjects.length
                                    console.log(subjectLenght)
                                    if(subjectLenght < 3){
                                        if(count < 1){
                                            user.subjects.push(localSubject)
                                            await User.findByIdAndUpdate(uid, (user), {new:true})
                                        } else{
                                            onlyOneAssign = false
                                        }
                                    } else{
                                        verifyLength = false
                                    }
                                }else{
                                    grant = false
                                }
                            }
                        })
                    } else {
                        verify = false
                    }
            } else{
                console.log('')
            }
        })
        if(verify){
            if(grant){
                if(verifyLength){
                    if(onlyOneAssign){
                        return res.status(200).json({
                            success:true,
                            msg:"Subject assigned",
                        })
                    } else{
                        return res.status(401).json({
                            msg: 'Subject has been assigned already.'
                        })
                    }
                } else{
                    return res.status(401).json({
                        msg: 'You have already assigned to three subjects.'
                    })
                }
            } else{
                return res.status(401).json({
                    msg: 'You are a teacher, you need to be a student to do this.'
                })
            }
        } else{
            return res.status(401).json({
                msg: 'Subject deleted you cant assign to this.'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error assigning subject',
            error
        })
    }
}

export const getStudentSubjects = async  (req = request, res = response) => {
    try {
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        const query = {state : true}
        
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])
        console.log('hola')
        
        let grant = true
        let listNull = true
        let subjectsList = []
        users.map( async localUser =>{
            if(localUser.id == uid){
                if(localUser.role == 'STUDENT_ROLE'){
                    if(localUser.subjects || localUser.subjects.length != 0){
                        subjectsList = localUser.subjects
                    } else{
                        listNull = false
                    }
                } else{
                    grant = false
                }
            }
        })
        
        if(grant){
            if(listNull){
                res.status(200).json({
                    succes: true,
                    total,
                    subjectsList
                })
            } else{
                res.status(401).json({
                    msg: 'You have not assigned to any subject.'
                })
            }
        } else{
            return res.status(401).json({
                msg: 'You need to be a student to do this.'
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error obtaining users',
            error
        })
    }
}

export const updateUser = async (req, res = response)=>{
    try {
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const {_id, password, email, ...data} = req.body

        if(password){
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(uid, (data), {new:true})
        res.status(200).json({
            success: true,
            msg: "User updated",
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating user',
            error
        })
    }
}

export const deleteUser = async (req, res = response)=>{
    try {
        const {id} = req.params
        const token = req.header('x-token')
        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        if(id == uid){
            const user = await User.findByIdAndUpdate(uid, {state:false}, {new:true})
            res.status(200).json({
                success: true,
                msg: "User updated",
                user
            })
        } else{
            res.status(401).json({
                success: false,
                msg: "You are not allowed to do that."
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating user',
            error
        })
    }
}