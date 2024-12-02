import React, { useState, useEffect } from 'react';
import { materialService } from '../services/material';
import { Material } from '../types';

const Materiais: React.FC = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [materialEditando, setMaterialEditando] = useState<Material | null>(null);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidade, setUnidade] = useState('');

  const carregarMateriais = async () => {
    try {
      const data = await materialService.listar();
      setMateriais(data);
      setErro('');
    } catch {
      setErro('Falha ao carregar materiais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMateriais();
  }, []);

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setUnidade('');
    setMaterialEditando(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      if (materialEditando) {
        await materialService.atualizar(materialEditando.id, {
          nome,
          descricao,
          unidade
        });
      } else {
        await materialService.criar({
          nome,
          descricao,
          unidade
        });
      }
      
      await carregarMateriais();
      setModalAberto(false);
      resetForm();
    } catch {
      setErro(`Falha ao ${materialEditando ? 'atualizar' : 'criar'} material`);
    }
  };

  const handleEditar = (material: Material) => {
    setMaterialEditando(material);
    setNome(material.nome);
    setDescricao(material.descricao || '');
    setUnidade(material.unidade);
    setModalAberto(true);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este material?')) {
      return;
    }

    try {
      await materialService.excluir(id);
      await carregarMateriais();
    } catch {
      setErro('Falha ao excluir material');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Materiais</h1>
        <button
          onClick={() => {
            resetForm();
            setModalAberto(true);
          }}
          className="btn-primary"
        >
          Novo Material
        </button>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {erro}
        </div>
      )}

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="py-3 px-6 text-left">Nome</th>
              <th className="py-3 px-6 text-left">Descrição</th>
              <th className="py-3 px-6 text-left">Unidade</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {materiais.map((material) => (
              <tr key={material.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6">{material.nome}</td>
                <td className="py-4 px-6">{material.descricao || '-'}</td>
                <td className="py-4 px-6">{material.unidade}</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleEditar(material)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(material.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {materialEditando ? 'Editar Material' : 'Novo Material'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome" className="form-label">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="descricao" className="form-label">Descrição</label>
                  <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="unidade" className="form-label">Unidade</label>
                  <input
                    type="text"
                    id="unidade"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalAberto(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {materialEditando ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materiais;