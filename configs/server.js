'use_strict';

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import limiter from '../src/middlewares/validate-cant-requests.js';
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
import subjectRoutes from '../src/subject/subject.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended:false }))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app) => {
    app.use('/schoolSystem/v1/auth', authRoutes)
    app.use('/schoolSystem/v1/users', userRoutes)
    app.use('/schoolSystem/v1/subjects', subjectRoutes)
}

const connectDB = async () => {
    try {
        await dbConnection()
        console.log('Database connected succesfully')
    } catch (error) {
        console.log('Error trying to connect to the database', error)
        process.exit(1)
    }
}

export const startServer = async () => {
    const app = express()
    const port = process.env.PORT || 3000

    try {
        middlewares(app)
        connectDB()
        routes(app)
        app.listen(port)
        console.log(`Server running on port: ${port}`)
    } catch (e) {
        console.log(e)
    }
}