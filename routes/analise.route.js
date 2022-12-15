import express from "express";
import AnaliseModel from "../model/analise.model.js";
import LogModel from "../model/log.model.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";

const analiseRoute = express.Router();

analiseRoute.get(
  "/all-analise",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { currentUser } = req;
      const analises = await AnaliseModel.find({ user: currentUser._id });
      return res.status(200).json(analises);
    } catch (error) {
      return res.status(500).json(error.errors);
    }
  }
);

analiseRoute.get("/view", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { currentUser } = req;
    const analises = await AnaliseModel.aggregate([
      { $match: { user: currentUser._id } },
      {
        $group: {
          _id: { cnpj: "$cnpj", ano: "$ano", trimestre: "$trimestre" },
          lastUpdate: { $max: "$updatedAt" },
        },
      },
      { $sort: { lastUpdate: -1 } },
      {
        $project: {
          _id: 0,
          lastUpdate: "$lastUpdate",
          cnpj: "$_id.cnpj",
          ano: "$_id.ano",
          trimestre: "$_id.trimestre",
        },
      },
    ]);
    return res.status(200).json(analises);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

analiseRoute.get(
  "/one-analise",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    const { query, currentUser } = req;
    if (
      !query.hasOwnProperty("cnpj") ||
      !query.hasOwnProperty("ano") ||
      !query.hasOwnProperty("trimestre")
    ) {
      return res.status(400).json({
        error:
          "Nem todos os campos de query preenchidos. Deve conter 'cnpj', 'ano' e 'trimestre'.",
      });
    }
    if (!query.cnpj.toString().match(/^\d{14}$/)) {
      return res.status(400).json({
        Erro: "Cnpj deve ter exatamente 14 digitos, e apenas digitos.",
      });
    }
    try {
      let analise = await AnaliseModel.find({
        user: currentUser,
        cnpj: query.cnpj,
        ano: query.ano,
        trimestre: query.trimestre,
      });
      if (analise.length === 0) {
        analise = await criarTrimestre(
          currentUser,
          query.cnpj,
          query.ano,
          query.trimestre
        );
      }
      return res.status(200).json(analise);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

analiseRoute.get("/acumulado", isAuth, attachCurrentUser, async (req, res) => {
  const { query, currentUser } = req;
  if (
    !query.hasOwnProperty("cnpj") ||
    !query.hasOwnProperty("ano") ||
    !query.hasOwnProperty("trimestre")
  ) {
    return res.status(400).json({
      error:
        "Nem todos os campos de query preenchidos. Deve conter 'cnpj', 'ano' e 'trimestre'.",
    });
  }
  if (!query.cnpj.toString().match(/^\d{14}$/)) {
    return res.status(400).json({
      Erro: "Cnpj deve ter exatamente 14 digitos, e apenas digitos.",
    });
  }
  try {
    const popularLinhas = [4, 5, 9, 12, 15, 19, 20, 42, 43];
    const popularCampos = [];
    for (let i = 0; i < popularLinhas.length; i++) {
      popularCampos.push(`desconsideradas_linha_${popularLinhas[i]}`);
    }
    let analise = await AnaliseModel.find({
      user: currentUser,
      cnpj: query.cnpj,
      ano: query.ano,
      trimestre: { $lte: query.trimestre },
    })
      .sort("mes")
      .populate(popularCampos);

    if (analise.filter((e) => e.trimestre === +query.trimestre).length === 0) {
      const novoTrimestre = await criarTrimestre(currentUser, query.cnpj, query.ano, query.trimestre);
      analise = [...analise, ...novoTrimestre];
    }
    
    return res.status(200).json(analise);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

analiseRoute.put("/update", isAuth, attachCurrentUser, async (req, res) => {
  const { query, currentUser } = req;
  const { cnpj, ano, mes, nLinha } = query;
  console.log(cnpj, ano, mes, nLinha)
  console.log(req.body)
  if (!(cnpj && ano && mes)) {
    return res.status(400).json({
      error:
        "Nem todos os campos de query preenchidos. Deve conter 'cnpj', 'ano' e 'mes'.",
    });
  }
  try {
    const response = await AnaliseModel.findOneAndUpdate(
      { user: currentUser._id, ano: ano, mes: mes },
      req.body,
      { new: true }
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

analiseRoute.delete(
  "/delete-trimestre",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    const { query, currentUser } = req;
    if (
      !query.hasOwnProperty("cnpj") ||
      !query.hasOwnProperty("ano") ||
      !query.hasOwnProperty("trimestre")
    ) {
      res.status(400).json({
        error:
          "Nem todos os campos de query preenchidos. Deve contem 'cnpj', 'ano' e 'trimestre' e os respesctivos valores.",
      });
    }
    try {
      const { deletedCount } = await AnaliseModel.deleteMany({
        user: currentUser._id,
        ano: query.ano,
        trimestre: query.trimestre,
      });
      if (deletedCount > 0) {
        res.status(204).json();
      } else {
        res.status(404).json({
          erro: "Não existem dados a serem apagados para este cnpj/ano/trimestre.",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

analiseRoute.delete(
  "/delete-all",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    const { currentUser } = req;
    try {
      console.log(await AnaliseModel.deleteMany({ user: currentUser._id }));
      return res.status(204).json();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);



analiseRoute.get("/analise-atual", isAuth, attachCurrentUser, async (req, res) => {
    
    const { query, currentUser } = req;
    
    if (!query.hasOwnProperty("cnpj") || !query.hasOwnProperty("ano") || !query.hasOwnProperty("trimestre")) {
      return res.status(400).json({error: "Nem todos os campos de query preenchidos. Deve conter 'cnpj', 'ano' e 'trimestre'."});
    }
    
    if (!query.cnpj.toString().match(/^\d{14}$/)) {
      return res.status(400).json({
        Erro: "Cnpj deve ter exatamente 14 digitos, e apenas digitos.",
      });
    }
    
    try {
      const popularLinhas = [4, 5, 9, 12, 15, 19, 20, 42, 43];
      const popularCampos = [];
      for (let i = 0; i < popularLinhas.length; i++) {
        popularCampos.push(`desconsideradas_linha_${popularLinhas[i]}`);
      }

      let analise = await AnaliseModel.find({user: currentUser, cnpj: query.cnpj, ano: query.ano, trimestre: query.trimestre}).sort({lastUpdate: -1}).limit(3).populate(popularCampos);
      
      const desconsideradas = [];

      analise.forEach(mes => {
        
        
        mes.desconsideradas_linha_4.forEach(nfe => {    
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })        
        });
        
        mes.desconsideradas_linha_5.forEach(nfe => {    
            desconsideradas.push({
              '_id': nfe._id,
              'operacao': nfe.operacao,
              'pais': nfe.pais,
              'cfop': nfe.cfop,
              'ncm': nfe.ncm,
              'desc_ncm': nfe.desc_ncm,
              'valor': nfe.valor,
              'ni': nfe.ni,
              'nome': nfe.nome
            })    
        });
        
        mes.desconsideradas_linha_9.forEach(nfe => {    
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })        
        });
        
        mes.desconsideradas_linha_12.forEach(nfe => {    
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })        
        });
        
        mes.desconsideradas_linha_15.forEach(nfe => {    
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })       
        });
        
        mes.desconsideradas_linha_19.forEach(nfe => {    
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })        
        });
        
        mes.desconsideradas_linha_20.forEach(nfe => {               
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })        
        });
        
        mes.desconsideradas_linha_42.forEach(nfe => {    
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })        
        });

        mes.desconsideradas_linha_43.forEach(nfe => {    
          desconsideradas.push({
            '_id': nfe._id,
            'operacao': nfe.operacao,
            'pais': nfe.pais,
            'cfop': nfe.cfop,
            'ncm': nfe.ncm,
            'desc_ncm': nfe.desc_ncm,
            'valor': nfe.valor,
            'ni': nfe.ni,
            'nome': nfe.nome
          })        
        });

      })
      
      
      //return res.status(200).json(analise);
      return res.status(200).json(desconsideradas);

    } catch (error) {
      return res.status(500).json(error);
    }
  }
);



async function criarTrimestre(user, cnpj, ano, trimestre) {
  const trimestre_array = [];
  for (let i = 0; i < 3; i++) {
    const mes = 3 * (trimestre - 1) + (i + 1);
    try {
      trimestre_array.push(
        await AnaliseModel.create({
          user: user._id,
          cnpj: cnpj,
          ano: ano,
          trimestre: trimestre,
          mes: mes,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
  return trimestre_array;
}

export default analiseRoute;
