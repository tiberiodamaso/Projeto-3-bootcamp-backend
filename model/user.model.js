import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLenght: 20,
        lowercase: true
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/

    },
    role: {
        type: String,
        enum: ['professora', 'aluno', 'TA'],
        default: 'aluno'
    },
    active: {
        type: Boolean,
        default: true
    },
    tasks: [{type: String}]
},
{
    timestamps: true
})  

const UserModel = model('User', userSchema)

export default UserModel