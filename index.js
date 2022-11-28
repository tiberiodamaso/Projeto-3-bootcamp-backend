import express from 'express'
import * as dotenv from 'dotenv'

// HABILITAR O SERVER A ACESSAR VARIÁVEIS DE AMBIENTE
dotenv.config()

// INSTANCIAR A VARIÁVEL QUE FICARÁ RESPONSÁVEL PELO NOSSO SERVIDOR
const app = express()

// CONFIGURAR O SERVIDOR PARA ACEITAR ENVIAR E RECEBER JSON
app.use(express.json())





app.listen(8080, () => {
    console.log('App up and running on port https://localhost:8080')
})
