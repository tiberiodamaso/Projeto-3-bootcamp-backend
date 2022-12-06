import { Schema, model } from "mongoose";

const userSchema = new Schema({
    cpf: {
        type: String,
        required: true,
        trim: true,
        minLength: 14,
        maxLenght: 14
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLenght: 20,
        lowercase: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLenght: 50,
        lowercase: true
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
        enum: ['Professor', 'Aluno', 'TA'],
        default: 'Aluno'
    },
    active: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true
})  

const UserModel = model('User', userSchema)

export default UserModel