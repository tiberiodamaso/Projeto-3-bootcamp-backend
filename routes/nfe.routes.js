import express from 'express';
import NfeModel from '../model/nfe.model.js';
import isAuth from '../middlewares/isAuth.js';
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import trimestre from '../utils/trimestre.js';

const nfeRoute = express.Router();

// ROTAS PARA MONGO

// All NFe - Retorna todas as notas para o trimestre da DCP em análise
nfeRoute.get('/all-nfe', isAuth, attachCurrentUser, async (req, res) => {
    try {
        const { lower, upper } = trimestre(req.query.trim);

        /*         const nfes = await NfeModel.find({
            cnpj: req.query.cnpj,
            ano: req.query.ano,
            $and: [{ mes: { $gte: lower } }, { mes: { $lte: upper } }],
        }); */
        const grupo = {
            $group: {
                _id: { ano: '$ano', mes: '$mes', cfop: '$cfop' },
                total: { $sum: '$valor' },
            },
        };
        const nfes = await NfeModel.aggregate([grupo]);

        return res.status(200).json(nfes);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.errors);
    }
});

nfeRoute.get('/one-nfe/:id', isAuth, attachCurrentUser, async (req, res) => {
    try {
        const { id } = req.params;

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