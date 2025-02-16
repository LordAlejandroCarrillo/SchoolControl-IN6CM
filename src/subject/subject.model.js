import { Schema, model } from "mongoose";

const SubjectSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength: [25, "Cant be overcome 25 characters"]
        },
        description: {
            type: String,
            required: false,
        },
        grade:{
            type: String,
            required: [true, "Grade is required"]
        },
        state: {
            type: Boolean,
            default: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required : true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Subject', SubjectSchema);