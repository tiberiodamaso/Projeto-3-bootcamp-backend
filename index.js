import express from 'express'
import * as dotenv from 'dotenv'
import connect from './config/db.config.js'
import userRoute from './routes/user.routes.js'

// HABILITAR O SERVER A ACESSAR VARIÁVEIS DE AMBIENTE
dotenv.config()

// INSTANCIAR A VARIÁVEL QUE FICARÁ RESPONSÁVEL PELO NOSSO SERVIDOR
const app = express()

// CONFIGURAR O SERVIDOR PARA ACEITAR ENVIAR E RECEBER JSON
app.use(express.json())

connect()

app.use('/user', userRoute)


app.listen(process.env.PORT, () => {
    console.log(`App up and running on port https://localhost:${process.env.PORT}`)
})
