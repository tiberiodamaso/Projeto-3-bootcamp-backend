import express from 'express'
import * as dotenv from 'dotenv'

// HABILITAR O SERVER A ACESSAR VARIÁVEIS DE AMBIENTE
dotenv.config()

// INSTANCIAR A VARIÁVEL QUE FICARÁ RESPONSÁVEL PELO NOSSO SERVIDOR
const app = express()

// CONFIGURAR O SERVIDOR PARA ACEITAR ENVIAR E RECEBER JSON
app.use(express.json())

// ROTAS
app.get('/', (req, res) => {
    
    const bemVindo = 'Bem vindo ao servidor'

    return res.status(200).json({msg: bemVindo})
})




app.listen(process.env.PORT, () => {
    console.log(`App up and running on port https://localhost:${process.env.PORT}`)
})
