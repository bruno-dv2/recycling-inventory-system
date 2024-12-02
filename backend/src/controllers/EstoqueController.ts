import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EstoqueController {
  async registrarEntrada(req: Request, res: Response): Promise<void> {
    try {
      const { materialId, quantidade, preco } = req.body;

      const entrada = await prisma.entrada.create({
        data: {
          materialId: Number(materialId),
          quantidade,
          preco
        },
        include: {
          material: true
        }
      });

      res.json(entrada);
    } catch {
      res.status(400).json({ erro: 'Falha ao registrar entrada' });
    }
  }

  async registrarSaida(req: Request, res: Response): Promise<void> {
    try {
      const { materialId, quantidade } = req.body;

      // Verificar saldo
      const entradas = await prisma.entrada.findMany({
        where: { materialId: Number(materialId) }
      });

      const saidas = await prisma.saida.findMany({
        where: { materialId: Number(materialId) }
      });

      const totalEntradas = entradas.reduce((sum, entrada) => sum + entrada.quantidade, 0);
      const totalSaidas = saidas.reduce((sum, saida) => sum + saida.quantidade, 0);
      const saldoAtual = totalEntradas - totalSaidas;

      if (saldoAtual < quantidade) {
        res.status(400).json({ erro: 'Quantidade insuficiente em estoque' });
        return;
      }

      const saida = await prisma.saida.create({
        data: {
          materialId: Number(materialId),
          quantidade
        },
        include: {
          material: true
        }
      });

      res.json(saida);
    } catch {
      res.status(400).json({ erro: 'Falha ao registrar saída' });
    }
  }

  async consultarSaldo(req: Request, res: Response): Promise<void> {
    try {
      const materiais = await prisma.material.findMany();
      const saldos = [];

      for (const material of materiais) {
        const entradas = await prisma.entrada.findMany({
          where: { materialId: material.id }
        });

        const saidas = await prisma.saida.findMany({
          where: { materialId: material.id }
        });

        const totalEntradas = entradas.reduce((sum, entrada) => sum + entrada.quantidade, 0);
        const totalSaidas = saidas.reduce((sum, saida) => sum + saida.quantidade, 0);
        const valorTotal = entradas.reduce((sum, entrada) => sum + (entrada.quantidade * entrada.preco), 0);
        const precoMedio = totalEntradas > 0 ? valorTotal / totalEntradas : 0;

        saldos.push({
          material: material.nome,
          quantidade: totalEntradas - totalSaidas,
          unidade: material.unidade,
          precoMedio
        });
      }

      res.json(saldos);
    } catch {
      res.status(400).json({ erro: 'Falha ao consultar saldo' });
    }
  }
}