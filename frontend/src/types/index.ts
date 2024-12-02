export interface Usuario {
    id: number;
    nome: string;
    email: string;
  }
  
  export interface Material {
    id: number;
    nome: string;
    descricao?: string;
    unidade: string;
  }
  
  export interface Entrada {
    id: number;
    materialId: number;
    quantidade: number;
    preco: number;
    data: Date;
    material: Material;
  }
  
  export interface Saida {
    id: number;
    materialId: number;
    quantidade: number;
    data: Date;
    material: Material;
  }
  
  export interface SaldoMaterial {
    material: string;
    quantidade: number;
    unidade: string;
    precoMedio: number;
  }
  
  export interface AuthResponse {
    usuario: Usuario;
    token: string;
  }