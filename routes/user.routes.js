import express from "express";

const userRoute = express.Router()

// BANCO DE DADOS
const bd = [
    {
        id: "696ca487-6a27-47cd-8e41-cc2b57eb7a61",
        name: 'Tibério Dâmaso Mendonça',
        age: 42,
        role: 'Aluno',
        active: true,
        tasks: [
            'CRUD no mongoDB'
        ]
    }
]

// ROTAS

// Home
userRoute.get('/', (req, res) => {
    return res.status(200).json({ msg: 'Bem vindo ao servidor' })
})

// All users
userRoute.get('/all-users', (req, res) => {

    return res.status(200).json({ bd: bd })
})

// Create user
userRoute.post('/create-user', (req, res) => {

    bd.push(req.body)

    return res.status(201).json({ bd: bd })
})

// Delete user
userRoute.delete('/delete-user/:id', (req, res) => {
    // Desconstrução do objeto req.params e salvando o id em uma const chamada id
    const {id} = req.params
    const user = bd.indexOf(bd.find((user) => user.id === id))
    bd.splice(user, 1)

    return res.status(200).json({ bd: bd })
})

// Update user
userRoute.put('/update-user/:id', (req, res) => {
    // Desconstrução do objeto req.params e salvando o id em uma const chamada id
    const {id} = req.params
    const user = bd.find((user) => user.id === id)
    const index = bd.indexOf(user)
    const clone = {...user, ...req.body}
    bd[index] = clone

    return res.status(201).json({ db: db })


    return res.status(201).json({ bd: bd })
})

export default userRoute