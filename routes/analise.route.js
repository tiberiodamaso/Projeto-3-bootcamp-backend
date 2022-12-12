import express from 'express';
import AnaliseModel from '../model/analise.model.js';
import LogModel from "../model/log.model.js";
import isAuth from '../middlewares/isAuth.js';
import attachCurrentUser from '../middlewares/attachCurrentUser.js';
import isAdmin from '../middlewares/isAdmin.js';
import trimestre from '../utils/trimestre.js';

const analiseRoute = express.Router();

analiseRoute.get('/all-analise', isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { currentUser } = req;
    return res.status(200).json("ok");
  } catch (error) {
    return res.status(500).json(error.errors);
  };
})

analiseRoute.get('/one-analise', isAuth, attachCurrentUser, async (req, res) => {
  const { query, currentUser } = req;
  if(!query.hasOwnProperty('cnpj') || !query.hasOwnProperty('ano') || !query.hasOwnProperty('trimestre')) {
    res.status(400).json({error: "Nem todos os campos de query preenchidos. Deve contem 'cnpj', 'ano' e 'trimestre' e os respesctivos valores."})
  }
  try {
    const analise = await AnaliseModel.find({user: currentUser._id, cnpj: query.cnpj, ano: query.ano, trimestre: query.trimestre});
    console.log(analise);
    return res.status(200).json(analise);
  } catch (error) {
    return res.status(500).json(error.errors);
  }
})

export default analiseRoute;