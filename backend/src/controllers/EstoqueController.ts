import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EstoqueController {
  async registrarEntrada(req: Request, res: Response): Promise<void> {
    try {
      const entradas = Array.isArray(req.body) ? req.body : [req.body];
      
      if (!entradas.length || !entradas.every(e => e.materialId && e.quantidade && e.preco)) {
        res.status(400).json({ erro: 'Dados de entrada inválidos. Verifique se selecionou o material.' });
        return;
      }

      for (const entrada of entradas) {
        const { materialId, quantidade, preco } = entrada;

        let estoque = await prisma.estoque.findUnique({
          where: { materialId: Number(materialId) }
        });

        if (estoque) {
          const novoValorTotal = estoque.valorTotal + (quantidade * preco);
          const novaQuantidade = estoque.quantidade + quantidade;
          const novoPrecoMedio = novoValorTotal / novaQuantidade;

          await prisma.estoque.update({
            where: { materialId: Number(materialId) },
            data: {
              quantidade: novaQuantidade,
              precoMedio: novoPrecoMedio,
              valorTotal: novoValorTotal
            }
          });
        } else {
          await prisma.estoque.create({
            data: {
              materialId: Number(materialId),
              quantidade: quantidade,
              precoMedio: preco,
              valorTotal: quantidade * preco
            }
          });
        }

        await prisma.entrada.create({
          data: {
            materialId: Number(materialId),
            quantidade,
            preco
          }
        });
      }

      res.json({ mensagem: 'Entradas registradas com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: 'Falha ao registrar entrada' });
    }
  }

  async registrarSaida(req: Request, res: Response): Promise<void> {
    try {
      const saidas = Array.isArray(req.body) ? req.body : [req.body];
      
      if (!saidas.length || !saidas.every(s => s.materialId && s.quantidade)) {
        res.status(400).json({ erro: 'Dados de saída inválidos. Verifique se selecionou o material.' });
        return;
      }

      for (const saida of saidas) {
        const { materialId, quantidade } = saida;

        const estoque = await prisma.estoque.findUnique({
          where: { materialId: Number(materialId) }
        });

        if (!estoque || estoque.quantidade < quantidade) {
          res.status(400).json({ erro: 'Quantidade insuficiente em estoque' });
          return;
        }

        await prisma.estoque.update({
          where: { materialId: Number(materialId) },
          data: {
            quantidade: estoque.quantidade - quantidade,
            valorTotal: (estoque.quantidade - quantidade) * estoque.precoMedio
          }
        });

        await prisma.saida.create({
          data: {
            materialId: Number(materialId),
            quantidade
          }
        });
      }

      res.json({ mensagem: 'Saídas registradas com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: 'Falha ao registrar saída' });
    }
  }

  async consultarSaldo(req: Request, res: Response): Promise<void> {
    try {
      const estoques = await prisma.estoque.findMany({
        where: {
          quantidade: {
            gt: 0
          }
        },
        include: {
          material: true
        }
      });

      const saldos = estoques.map(estoque => ({
        material: estoque.material.nome,
        quantidade: estoque.quantidade,
        unidade: estoque.material.unidade,
        precoMedio: estoque.precoMedio,
        valorTotal: estoque.valorTotal
      }));

      res.json(saldos);
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: 'Falha ao consultar saldo' });
    }
  }
}