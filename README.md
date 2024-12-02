# Sistema de Controle de Estoque para Reciclagem

Sistema completo para gerenciamento de estoque de materiais recicláveis, desenvolvido com Node.js no backend e React no frontend.

## Funcionalidades

### Autenticação
- Login e registro de usuários
- Autenticação via JWT
- Rotas protegidas

### Gerenciamento de Materiais
- Cadastro de materiais recicláveis
- Listagem de todos os materiais
- Atualização de informações
- Exclusão de materiais

### Controle de Estoque
- Registro de entradas com quantidade e preço
- Registro de saídas
- Cálculo automático de preço médio
- Saldo atual por material
- Valor total em estoque

### Dashboard
- Visão geral do estoque
- Indicadores principais
- Alertas de itens em baixa quantidade
- Acesso rápido às principais funções

## Tecnologias

### Backend
- Node.js
- TypeScript
- Express.js
- Prisma (ORM)
- MySQL
- JSON Web Token
- BCrypt

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- NPM ou Yarn

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/bruno-dv2/sistema-reciclagem.git
cd sistema-reciclagem
```

2. Backend
```bash
# Entra na pasta do backend
cd backend

# Instala as dependências
npm install

# Configura o arquivo .env
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executa as migrations do banco
npx prisma migrate dev

# Inicia o servidor
npm run dev
```

3. Frontend
```bash
# Entra na pasta do frontend
cd frontend

# Instala as dependências
npm install

# Inicia a aplicação
npm run dev
```
