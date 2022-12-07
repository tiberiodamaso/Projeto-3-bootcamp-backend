import { Schema, model } from 'mongoose';

const dcpSchema = new Schema({
    cnpj: { type: String, required: true },
    Ano: { type: Number, required: true },
    Mes: { type: Number, required: true },
    Exportacao_direta: { type: Number },
    Vendas_a_comercial_exportadora: { type: Number },
    Total_da_receita_de_exportacao: { type: Number },
    Receita_operacional_bruta: { type: Number },
    Insumos_Compras_credito: { type: Number },
    Insumos_Compras_totais: { type: Number },
    Insumos_Estoque_inicial: { type: Number },
    Insumos_Estoque_final: { type: Number },
    Insumos_Saidas_nao_aplicadas: { type: Number },
    Insumos_Utilizados: { type: Number },
    Insumos_Exclusao: { type: Number },
    Insumos_Acrescimo: { type: Number },
    Combustivel_Compras_credito: { type: Number },
    Combustivel_Compras_totais: { type: Number },
    Combustivel_Estoque_inicial: { type: Number },
    ombustivel_Estoque_final: { type: Number },
    Combustivel_Saidas_nao_aplicadas: { type: Number },
    Combustivel_Utilizados: { type: Number },
    Combustivel_Exclusao: { type: Number },
    Combustivel_Acrescimo: { type: Number },
    Energia_Compras_credito: { type: Number },
    Energia_Exclusao: { type: Number },
    Energia_Acrescimo: { type: Number },
    Servico_Utilizados: { type: Number },
    Servico_Exclusao: { type: Number },
    Servico_Acrescimo: { type: Number },
    CP_Deduzidos: { type: Number },
    CP_Transferidos: { type: Number },
    CP_Pedidos_de_ressarcimento,
});

const DcpModel = model('Dcp', dcpSchema);

export default DcpModel;
