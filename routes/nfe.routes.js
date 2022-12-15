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

// NFes por mês
nfeRoute.get('/mes', isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { cnpj, ano, mes, nLinha } = req.query;
    // console.log(cnpj, ano, mes, nLinha)
    let cfops
    if (nLinha === '4') {
      cfops = ["7101", "7105", "7127"]
    }
    if (nLinha === '5') {
      cfops = ["5501", "6501"]
    }
    if (nLinha === '9') {
      cfops = ["5101",
        "5102",
        "5103",
        "5105",
        "5109",
        "5111",
        "5113",
        "5116",
        "5118",
        "5122",
        "5124",
        "5125",
        "5403",
        "5405",
        "5656",
        "5501",
        "6101",
        "6102",
        "6103",
        "6105",
        "6107",
        "6108",
        "6109",
        "6111",
        "6113",
        "6116",
        "6118",
        "6122",
        "6124",
        "6125",
        "6401",
        "6403",
        "6405",
        "6501",
        "7101",
        "7105",
        "7127"]
    }
    if (nLinha === '12') {
      cfops = [
        "1101",
        "1111",
        "1116",
        "1120",
        "1122",
        "2101",
        "2111",
        "2116",
        "2120",
        "2122"]
    }
      
    const nfes = await NfeModel.find({
      'cnpj': cnpj,
      'ano': ano,
      'mes': mes,
      'cfop': {
        '$in':
          cfops
      }
    })
    return res.status(200).json(nfes);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.errors);
  }
});

export default nfeRoute;
