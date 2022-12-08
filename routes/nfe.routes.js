import express from 'express';
import NfeModel from '../model/nfe.model.js';
import isAuth from '../middlewares/isAuth.js';
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import isAdmin from '../middlewares/isAdmin.js';

const nfeRoute = express.Router();

// ROTAS PARA MONGO

// All NFe
nfeRoute.get('/all-nfe', isAuth, attachCurrentUser, async (req, res) => {
    try {
        console.log('rota ok');
        const nfes = await NfeModel.find(
            { ano: 2020, mes: 1 },
            { ano: 1, mes: 1 },
            { ano: 1, mes: 1 }
        );
        return res.status(200).json(nfes);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.errors);
    }
});

nfeRoute.get('/one-nfe/:id', isAuth, attachCurrentUser, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const nfe = await NfeModel.findById(id);
        if (!nfe) {
            return res.status(400).json({ msg: 'Nota Fiscal não encontrada!' });
        }
        return res.status(200).json(nfe);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.errors);
    }
});

export default nfeRoute;
