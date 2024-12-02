import React, { useState } from 'react';
import { Material } from '../types';

interface MovimentacaoFormProps {
  materiais: Material[];
  tipo: 'entrada' | 'saida';
  onSubmit: (data: { materialId: number; quantidade: number; preco?: number }) => Promise<void>;
  onCancel: () => void;
}

const MovimentacaoForm: React.FC<MovimentacaoFormProps> = ({
  materiais,
  tipo,
  onSubmit,
  onCancel
}) => {
  const [materialId, setMaterialId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!materialId || !quantidade) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    if (tipo === 'entrada' && !preco) {
      setErro('Informe o preço para entrada');
      return;
    }

    try {
      await onSubmit({
        materialId: Number(materialId),
        quantidade: Number(quantidade),
        ...(tipo === 'entrada' && { preco: Number(preco) })
      });

      setMaterialId('');
      setQuantidade('');
      setPreco('');
    } catch {
      setErro('Erro ao registrar movimentação');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {erro}
        </div>
      )}

      <div>
        <label htmlFor="material" className="form-label">
          Material
        </label>
        <select
          id="material"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Selecione um material</option>
          {materiais.map((material) => (
            <option key={material.id} value={material.id}>
              {material.nome} ({material.unidade})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quantidade" className="form-label">
          Quantidade
        </label>
        <input
          type="number"
          id="quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          step="0.01"
          min="0"
          className="input-field"
          required
        />
      </div>

      {tipo === 'entrada' && (
        <div>
          <label htmlFor="preco" className="form-label">
            Preço Unitário (R$)
          </label>
          <input
            type="number"
            id="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            step="0.01"
            min="0"
            className="input-field"
            required
          />
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
        </button>
      </div>
    </form>
  );
};

export default MovimentacaoForm;