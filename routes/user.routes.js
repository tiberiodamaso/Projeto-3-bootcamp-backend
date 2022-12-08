import express from "express";
import UserModel from "../model/user.model.js";
import bcrypt from 'bcrypt'
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import nodemailer from 'nodemailer'

const userRoute = express.Router()
const saltRounds = 10
const transporter = nodemailer.createTransport({
  service: 'Hotmail',
  auth: {
    secure: false,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
})

// ROTAS PARA MONGO
// New user
userRoute.post('/signup', async (req, res) => {
  try {
    // Capturando a senha do frontend
    const { password, email } = req.body

    // Checando se a senha existe e se atende aos critérios de segurança
    if (!password || !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)) {
      return res.status(400).json({ msg: 'Senha não tem os requisitos mínimos de segurança' })
    }

    // Gerar o salt da senha
    const salt = await bcrypt.genSalt(saltRounds)

    // Hashear a senha
    const hashedPassword = await bcrypt.hash(password, salt)

    // Criar o usuário com a senha hasheada
    const newUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword
    })

    // Deleta o passwordHash do obj antes de retornar a resposta
    delete newUser._doc.hashedPassword

    // Envia email de confirmação
    const mailOptions = {
      from: 'tiberio.mendonca@meucontato.app.br',
      to: email,
      subject: 'Ativação de conta',
      html: `
      <h1>Bem vindo ao nosso site</h1>
      <p>Confirme seu email clicando no link abaixo</p>
      <a href="http://127.0.0.1:8082/user/activate-account/${newUser._id}">Ative sua conta</a>
      `
    }

    await transporter.sendMail(mailOptions)

    return res.status(201).json(newUser)

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Algo deu errado na criação do usuário' })
  }
})

// Activate user
userRoute.get('/activate-account/:id', async (req, res) => {
  try {
    // Capturando o id do usuário
    const { id } = req.params
    const user = await UserModel.findByIdAndUpdate(id, {confirmEmail: true, active: true})

    return res.send(`Sua conta foi ativada com sucesso ${user.first_name}`)

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Algo deu errado na ativação do usuário' })
  }
})

// Login
userRoute.post('/login', async (req, res) => {
  try {
    // Capturando email e senha do frontend
    const { email, password } = req.body

    // Achar o user pelo email
    const user = await UserModel.findOne({ email: email })

    // Chegar se o email existe
    if (user.confirmEmail === false) {
      return res.status(401).json({ msg: 'Usuário não confirmado, favor validar email' })
    }

    // Chegar se o usuário existe
    if (!user) {
      return res.status(400).json({ msg: 'Usuário não cadastrado' })
    }

    // Comparar as senhas
    if (await bcrypt.compare(password, user.passwordHash)) {

      // Delete o passworHash antes de devolver a resposta
      delete user._doc.passwordHash

      // Devolte um token de acesso
      const token = generateToken(user)
      return res.status(200).json({ user: user, token: token })

    } else {
      return res.status(401).json({ msg: 'Email ou senha incorretos' })
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: 'Algo deu errado no login' })
  }
})

// Profile
userRoute.get('/profile', isAuth, attachCurrentUser, async (req, res) => {
  try {
    return res.status(200).json(req.currentUser)
  } catch (error) {
    console.log(error)
    return res.status(400).json(error.errors)
  }
})

// All users
userRoute.get('/all-users', isAuth, isAdmin, async (req, res) => {
  try {

    // find vazio -> todas as ocorrencias
    // projections -> defini os campos que vão ser retornados
    const users = await UserModel.find({}, { __v: 0, passwordHash: 0 })
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
userRoute.delete('/delete', isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUserId = req.currentUser._id
    const user = await UserModel.findByIdAndDelete(loggedInUserId) // Mongoose

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
userRoute.put('/update', isAuth, attachCurrentUser, async (req, res) => {
  try {

    const loggedInUserId = req.currentUser._id

    // Mongoose
    const updatedUser = await UserModel.findByIdAndUpdate(
      loggedInUserId,
      { ...req.body },
      { new: true, runValidators: true } // new retorna o usuário atualizado e não a antiga
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


// // All users com sort e limit
// userRoute.get('/all-users', async (req, res) => {
//   try {

//     // find vazio -> todas as ocorrencias
//     // projections -> defini os campos que vão ser retornados
//     // sort() -> ordenada o retorno dos dados
//     // limit() -> define quantas ocorrencias serão retornadas
//     const users = await UserModel.find({}, { __v: 0, updatedAt: 0, createdAt: 0 }).sort({ age: 1 }).limit(100)
//     return res.status(200).json(users)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json(error.errors)
//   }
// })