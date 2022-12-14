import mongoose, { Schema, model, Types } from "mongoose";

const analiseSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true, immutable: true },
  cnpj: { type: String, required: true, match: /^\d{14}$/, immutable: true },
  ano: { type: Number, required: true, min: 2000, max: 2100, immutable: true },
  trimestre: { type: Number, required: true, min: 1, max: 4, immutable: true },
  mes: { type: Number, required: true, min: 1, max: 12, immutable: true },
  desconsideradas_linha_4: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_5: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_9: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_12: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_15: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_19: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_20: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_42: [{ type: Types.ObjectId, ref: "Nfe" }],
  desconsideradas_linha_43: [{ type: Types.ObjectId, ref: "Nfe" }],
},
{ timestamps: true });

const AnaliseModel = model("Analise", analiseSchema);

export default AnaliseModel;
