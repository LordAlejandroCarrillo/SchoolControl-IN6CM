import mongoose, { mongo } from "mongoose";

const RoleSchema = new mongoose.Schema({
    role:{
        type: String,
        required : [true, 'El rol es obligatorio']
    }
})

export default mongoose.model('Role', RoleSchema)