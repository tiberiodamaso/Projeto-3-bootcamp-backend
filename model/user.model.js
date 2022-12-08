import { Schema, model } from "mongoose";
import validarCPF from '../utils/validarCPF.js'

const userSchema = new Schema({
    cpf: {
        type: String,
        required: true,
        trim: true,
        minLength: 14,
        maxLenght: 14,
        validate: {
          validator: function(v){
            return validarCPF(v)
          },
          message: props => `${props.value} is not a valid CPF!`
        }
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
        enum: ['user', 'admin'],
        default: 'user'
    },
    imgProfile: {
        type: String,
        default: ''
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    passwordHash: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
})  

const UserModel = model('User', userSchema)

export default UserModel