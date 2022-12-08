import express from 'express';
import * as dotenv from 'dotenv';
import connect from './config/db.config.js';
import userRoute from './routes/user.routes.js';
import cors from 'cors';
import uploadRoute from './routes/uploadImage.routes.js';
import dcpRoute from './routes/dcp.routes.js';
import nfeRoute from './routes/nfe.routes.js';

// HABILITAR O SERVER A ACESSAR VARIÁVEIS DE AMBIENTE
dotenv.config();

// INSTANCIAR A VARIÁVEL QUE FICARÁ RESPONSÁVEL PELO NOSSO SERVIDOR
const app = express();

// CONFIGURAR O SERVIDOR PARA ACEITAR ENVIAR E RECEBER JSON
app.use(express.json());

// CONFIGURAR O SERVIDOR PARA CORS
app.use(cors());

connect();

app.use('/user', userRoute);
app.use('/uploadImage', uploadRoute);
app.use('/dcp', dcpRoute);
app.use('/nfe', nfeRoute);

app.listen(process.env.PORT, () => {
    console.log(
        `App up and running on port https://localhost:${process.env.PORT}`
    );
});
