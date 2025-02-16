import { response, request } from "express"
import { hash, verify } from "argon2"
import jwt from "jsonwebtoken"
import Subject from "../subject/subject.model.js"
import User from "../users/user.model.js"

export const addSubject = async (req, res)=>{
    const token = await req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    const query = {state : true}

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ])

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const data = req.body
        console.log(uid)
        users.map(async user => {
            if(user.id == uid){
                console.log(user)
                console.log(user.role)
                if(user.role == "TEACHER_ROLE"){
                    const subject = await Subject.create({
                        name: data.name,
                        description : data.description,
                        grade : data.grade,
                        teacher: uid
                    })
                    if(user.role == "TEACHER_ROLE"){
                        return res.status(201).json({
                            message: "Subject created successfully",
                            subject
                        })
                    }
                } else{
                    return res.status(401).json({
                        msg: 'Function not granted for students'
                    })
                }
            }
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Subject registration failed",
            error: e.message
        })
    }
}

export const getSubjects = async (req = request, res = response) => {
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
        let subjectOfTeacher = []
        subjects.map(localSubject =>{
            if(localSubject.teacher == uid){
                subjectOfTeacher.push(localSubject)
            }
        })
        let currentUserRole = ''
        users.map(user =>{
            if(user.id == uid){
                currentUserRole = user.role
            }
        })
        console.log(subjectOfTeacher)
        if(subjectOfTeacher.length != 0){
            res.status(200).json({
                succes: true,
                total,
                subjectOfTeacher
            })
        } else{
            if(currentUserRole == 'TEACHER_ROLE'){
                return res.status(401).json({
                    msg: 'Teacher doesnt have subjects created.'
                })
            } else{
                return res.status(401).json({
                    msg: 'You are not even a teacher.(You need to enter to the get of students in order to watch your subjects).'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error getting subjects',
            error
        })
    }
}

export const editSubjectById = async (req = request, res = response)=>{
    try {
        const query = {state : true}
        const [total, subjects] = await Promise.all([
            Subject.countDocuments(query),
            Subject.find(query)
        ])

        const token = req.header('x-token')

        if(!token){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            })
        }
        const data = req.body
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const { id } = req.params
        let verify = true
        let grant = true
        subjects.map( async localSubject =>{
            if(localSubject.id == id){
                if(localSubject.teacher == uid){
                    if(localSubject.state === false){
                        verify = false
                    } else {
                        await Subject.findByIdAndUpdate(id, (data), {new:true})
                        return
                    }
                } else{
                    grant = false
                }
            } else{
                console.log('')
            }
        })
        if(grant){
            if(verify){
                return res.status(200).json({
                    success:true,
                    msg:"Subject updated",
                })
            } else{
                return res.status(401).json({
                    msg: 'Subject has been updated already.'
                })
            }
        } else{
            res.status(401).json({
                msg: 'You are not granted to do that. (Even if you are a teacher. You need to be the owner of te subject.)'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error updating subject',
            error
        })
    }
}

export const deleteSubject = async (req = request, res = response) => {
    try {
        const query = {state : true}
        const [total, subjects] = await Promise.all([
            Subject.countDocuments(query),
            Subject.find(query)
        ])

        const[totalUsr, users] = await Promise.all([
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
        subjects.map( async localSubject =>{
            if(localSubject.id == id){
                if(localSubject.teacher == uid){
                    if(localSubject.state === false){
                        verify = false
                    } else {
                        await Subject.findByIdAndUpdate(id, {state:false}, {new:true})
                        return
                    }
                } else{
                    grant = false
                }
            } else{
                verify = false
            }
        })
        let count = 0
        users.map(async localUser =>{
            if(localUser.subjects || localUser.subjects != 0){
                localUser.subjects.map( localSubjectConsole =>{
                    if(localSubjectConsole._id.toString() == id){
                        console.log(`Subject ${localSubjectConsole.name} has been deleted from ${localUser.username} user.`)
                    }
                })
                localUser.subjects = localUser.subjects.filter(localSubject =>
                    localSubject._id.toString() != id
                )
            }
            await User.findByIdAndUpdate(localUser.id, {subjects:localUser.subjects}, {new:true})
        })
        if(grant){
            if(verify){
                return res.status(200).json({
                    success:true,
                    msg:"Subject desactivated",
                })
            } else{
                return res.status(401).json({
                    msg: 'Subject has been deleted already.'
                })
            }
        } else{
            res.status(401).json({
                msg: 'You are not granted to do that. (Even if you are a teacher. You need to be the owner of te subject.)'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error desactivating subject',
            error
        })
    }
}