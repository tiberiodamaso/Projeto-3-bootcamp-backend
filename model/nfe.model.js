import { Schema, model } from 'mongoose';

const nfeSchema = new Schema({
    operacao: { type: String, required: true, enum: ['ENTRADA', 'SAIDA'] },
    ano: { type: Number, required: true, min: 2000, max: 2050 },
    mes: { type: Number, required: true, min: 1, max: 12 },
    chave: { type: String, required: true, minLength: 44, maxLenght: 44 },
    ni: { type: String, required: true, minLength: 14, maxLenght: 18 },
    nome: { type: String, required: true, minLength: 6, maxLenght: 60 },
    pais: { type: String, required: true },
    cfop: { type: String, required: true },
    desc_cfop: { type: String, required: true },
    ncm: { type: String, required: true },
    desc_nmc: { type: String, required: true },
    mercadoria: { type: String, required: true },
    valor: { type: Schema.Types.Decimal128 },
});

const NfeModel = model('Nfe', nfeSchema);

export default NfeModel;
