import mongoose, { Schema, model, Types } from 'mongoose';

const analiseSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    cnpj: { type: String, required: true },
    ano: { type: Number, required: true },
    trimestre: { type: Number, required: true },
    mes: { type: Number, required: true },
    desconsideradas_linha_4: [{ type: Types.ObjectId, ref: 'Nfe' }],
    desconsideradas_linha_5: [{ type: Types.ObjectId, ref: 'Nfe' }],
});

const AnaliseModel = model('Analise', analiseSchema);

export default AnaliseModel;
