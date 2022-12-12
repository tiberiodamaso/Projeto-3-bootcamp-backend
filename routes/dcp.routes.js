import express from 'express';
import DcpModel from '../model/dcp.model.js';
import LogModel from '../model/log.model.js';
import isAuth from '../middlewares/isAuth.js';
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import isAdmin from '../middlewares/isAdmin.js';
import trimestre from '../utils/trimestre.js';

const dcpRoute = express.Router();

// ROTAS PARA MONGO

// All DCP
dcpRoute.get('/all-dcp', isAuth, attachCurrentUser, async (req, res) => {
    try {
        const { cnpj } = req.query;
        const { lower, upper } = trimestre(req.query.trim);
        console.log(cnpj, lower, upper, req.query.trim);
        const dcps = await DcpModel.find({
            cnpj: cnpj,
            ano: req.query.ano,
            $and: [{ mes: { $gte: lower } }, { mes: { $lte: upper } }],
        });
        return res.status(200).json(dcps);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.errors);
    }
});

dcpRoute.get('/one-dcp/:id', isAuth, attachCurrentUser, async (req, res) => {
    try {
        const { id } = req.params;
        const dcp = await DcpModel.findById(id);
        return res.status(200).json(dcp);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.errors);
    }
});

// DCPs by CNPJ
dcpRoute.get('/cnpj/:cnpj', isAuth, attachCurrentUser, async (req, res) => {
    try {
        const { cnpj } = req.params;
        const dcps = await DcpModel.find({ Cnpj: cnpj });

        //LOG - Novo login
        await LogModel.create({
            user: req.currentUser._id,
            route: 'CNPJ',
            log: `Consulta DCP do CNPJ: ${cnpj}`,
        });

        return res.status(200).json(dcps);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.errors);
    }
});

export default dcpRoute;
