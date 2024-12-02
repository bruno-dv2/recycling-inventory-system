import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaterialController {
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const materiais = await prisma.material.findMany();
      res.json(materiais);
    } catch {
      res.status(400).json({ erro: 'Falha ao listar materiais' });
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, descricao, unidade } = req.body;

      const materialExiste = await prisma.material.findUnique({
        where: { nome }
      });

      if (materialExiste) {
        res.status(400).json({ erro: 'Material já existe' });
        return;
      }

      const material = await prisma.material.create({
        data: {
          nome,
          descricao,
          unidade
        }
      });

      res.json(material);
    } catch {
      res.status(400).json({ erro: 'Falha ao criar material' });
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, descricao, unidade } = req.body;

      const material = await prisma.material.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          unidade
        }
      });

      res.json(material);
    } catch {
      res.status(400).json({ erro: 'Falha ao atualizar material' });
    }
  }

  async excluir(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.material.delete({
        where: { id: Number(id) }
      });

      res.json({ mensagem: 'Material excluído com sucesso' });
    } catch {
      res.status(400).json({ erro: 'Falha ao excluir material' });
    }
  }
}