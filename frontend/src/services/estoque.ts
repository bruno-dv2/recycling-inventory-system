import api from './api';
import { Entrada, Saida, SaldoMaterial } from '../types';

export const estoqueService = {
  async registrarEntrada(materialId: number, quantidade: number, preco: number) {
    const response = await api.post<Entrada>('/estoque/entrada', {
      materialId,
      quantidade,
      preco
    });
    return response.data;
  },

  async registrarSaida(materialId: number, quantidade: number) {
    const response = await api.post<Saida>('/estoque/saida', {
      materialId,
      quantidade
    });
    return response.data;
  },

  async consultarSaldo() {
    const response = await api.get<SaldoMaterial[]>('/estoque/saldo');
    return response.data;
  },

  async consultarHistorico(materialId: number) {
    const response = await api.get(`/estoque/historico/${materialId}`);
    return response.data;
  }
};

export default estoqueService;