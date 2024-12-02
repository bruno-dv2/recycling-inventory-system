import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Material, SaldoMaterial } from '../types';
import { materialService } from '../services/material';
import { estoqueService } from '../services/estoque';

const SaidaMaterial: React.FC = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [saldos, setSaldos] = useState<SaldoMaterial[]>([]);
  const [materialId, setMaterialId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [materiaisData, saldosData] = await Promise.all([
        materialService.listar(),
        estoqueService.consultarSaldo()
      ]);
      setMateriais(materiaisData);
      setSaldos(saldosData);
    } catch {
      setErro('Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const getSaldoMaterial = (id: number) => {
    const material = materiais.find(m => m.id === id);
    if (!material) return null;
    return saldos.find(s => s.material === material.nome);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setSucesso(false);

    const saldoAtual = getSaldoMaterial(Number(materialId));
    if (!saldoAtual || saldoAtual.quantidade < Number(quantidade)) {
      setErro('Quantidade insuficiente em estoque');
      setSalvando(false);
      return;
    }

    try {
      await estoqueService.registrarSaida(
        Number(materialId),
        Number(quantidade)
      );
      setSucesso(true);
      setMaterialId('');
      setQuantidade('');

      setTimeout(() => {
        navigate('/estoque');
      }, 2000);
    } catch {
      setErro('Falha ao registrar saída');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-700">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Registrar Saída de Material</h1>
        </div>

        <div className="p-6">
          {erro && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{erro}</p>
                </div>
              </div>
            </div>
          )}

          {sucesso && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Saída registrada com sucesso!</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                Material
              </label>
              <select
                id="material"
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Selecione um material</option>
                {materiais.map((material) => {
                  const saldo = getSaldoMaterial(material.id);
                  return (
                    <option key={material.id} value={material.id}>
                      {material.nome} ({material.unidade}) - Saldo: {saldo ? saldo.quantidade.toFixed(2) : '0'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                step="0.01"
                min="0"
                required
              />
              {materialId && (
                <p className="mt-1 text-sm text-gray-500">
                  Saldo disponível: {getSaldoMaterial(Number(materialId))?.quantidade.toFixed(2) || '0'} {
                    materiais.find(m => m.id === Number(materialId))?.unidade
                  }
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/estoque')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  salvando ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {salvando ? 'Registrando...' : 'Registrar Saída'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaidaMaterial;