import express from "express";
import UserModel from "../model/user.model.js";

const userRoute = express.Router()

// ROTAS PARA MONGO
// New user
userRoute.post('/new-user', async (req, res) => {
    try {
        const form = req.body
        const newUser = await UserModel.create(form)
        return res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Algo deu errado na criação do usuário' })
    }
})

// All users
userRoute.get('/all-users', async (req, res) => {
    try {

        // find vazio -> todas as ocorrencias
        // projections -> defini os campos que vão ser retornados
        // sort() -> ordenada o retorno dos dados
        // limit() -> define quantas ocorrencias serão retornadas
        const users = await UserModel.find({}, { __v: 0, updatedAt: 0, createdAt: 0 }).sort({ age: 1 }).limit(100)
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.errors)
    }
})

// Get one user
userRoute.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        // const user = await UserModel.find({ _id: id }) // Mongo
        const user = await UserModel.findById(id) // Mongoose

        if (!user) {
            return res.status(400).json({ msg: 'Usuário não encontrado' })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.errors)
    }
})

// Delete user
userRoute.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await UserModel.findByIdAndDelete(id) // Mongoose

        if (!user) {
            return res.status(400).json({ msg: 'Usuário não encontrado' })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.errors)
    }
})

// Update user
userRoute.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params

        // Mongoose
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { ...req.body },
            {new: true, runValidators: true} // new retorna o usuário atualizado e não a antiga
        )

        if (!updatedUser) {
            return res.status(400).json({ msg: 'Usuário não encontrado' })
        }

        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json(error.errors)
    }
})

export default userRoute