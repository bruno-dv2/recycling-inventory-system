import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaterialController {
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const materiais = await prisma.material.findMany({
        include: {
          estoque: true
        }
      });
      res.json(materiais);
    } catch (error) {
      console.error(error);
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
        res.status(400).json({ erro: 'Já existe um material cadastrado com este nome' });
        return;
      }

      const material = await prisma.material.create({
        data: {
          nome,
          descricao,
          unidade
        }
      });

      res.json({ 
        material,
        mensagem: 'Material cadastrado com sucesso'
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: 'Falha ao criar material' });
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, descricao, unidade } = req.body;

      const materialExistente = await prisma.material.findFirst({
        where: {
          nome,
          NOT: {
            id: Number(id)
          }
        }
      });

      if (materialExistente) {
        res.status(400).json({ erro: 'Já existe um material cadastrado com este nome' });
        return;
      }

      const material = await prisma.material.update({
        where: { id: Number(id) },
        data: {
          nome,
          descricao,
          unidade
        }
      });

      res.json({ 
        material,
        mensagem: 'Material atualizado com sucesso'
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: 'Falha ao atualizar material' });
    }
  }

  async excluir(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const estoque = await prisma.estoque.findUnique({
        where: { materialId: Number(id) }
      });

      if (estoque && estoque.quantidade > 0) {
        res.status(400).json({ 
          erro: 'Não é possível excluir material com quantidade em estoque'
        });
        return;
      }

      await prisma.$transaction([
        prisma.entrada.deleteMany({ where: { materialId: Number(id) } }),
        prisma.saida.deleteMany({ where: { materialId: Number(id) } }),
        prisma.estoque.deleteMany({ where: { materialId: Number(id) } }),
        prisma.material.delete({ where: { id: Number(id) } })
      ]);

      res.json({ mensagem: 'Material excluído com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: 'Falha ao excluir material' });
    }
  }
}
