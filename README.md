# 🩺 Medi-App Backend

<p align="center">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

Este repositório contém o backend do **Medi-App**, um sistema para gerenciamento de consultórios médicos, desenvolvido originalmente como parte da disciplina de **Programação II** da **Faculdade Descomplica**. O projeto foi reestruturado com foco em escalabilidade, segurança e boas práticas de desenvolvimento utilizando NestJS.

---

## 📑 Sumário

- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Como Executar](#-como-executar)
- [Documentação da API](#-documentação-da-api)
- [Licença](#-licença)

---

## 🚀 Tecnologias

O projeto foi construído utilizando as seguintes ferramentas:

| Categoria | Tecnologia |
| :--- | :--- |
| **Framework** | [NestJS](https://nestjs.com/) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) |
| **Banco de Dados** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Segurança** | [JWT](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **Infraestrutura** | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) |
| **Outros** | [Class-Validator](https://github.com/typestack/class-validator), [Cookie-Parser](https://github.com/expressjs/cookie-parser), [PDFKit](http://pdfkit.org/) |

---

## ✨ Funcionalidades

- 🔐 **Autenticação**: Login seguro para Médicos e Pacientes usando JWT e Refresh Tokens.
- 👨‍⚕️ **Médicos**: Gerenciamento de perfil, especialidades e agenda.
- 🤕 **Pacientes**: Cadastro, histórico e agendamentos.
- 📅 **Agendamentos**: Sistema de marcação de consultas entre médicos e pacientes.
- 📝 **Prescrições**: Geração de prescrições médicas (com suporte a arquivos/PDF).
- 🛡️ **Segurança e Arquitetura**: 
    - **IsOwnerGuard**: Proteção automática de recursos via decorador `@IsOwner()`, garantindo que usuários só alterem seus próprios dados.
    - **HashingService**: Centralização de criptografia (bcrypt) para senhas e tokens.
    - **Rate-limiting**: Throttling configurado para prevenir ataques de força bruta.
    - Validação global de dados (DTPs) e tratamento de erros centralizado.
- 📋 **Documentação**: API completamente documentada via Swagger.

---

## 📂 Estrutura do Projeto

```bash
src/
├── app.module.ts          # Módulo principal
├── main.ts                # Ponto de entrada (Bootstrap)
├── auth/                  # Autenticação e Hashing
├── doctor/                # Domínio de Médicos
├── patient/               # Domínio de Pacientes
├── appointment/           # Domínio de Agendamentos
├── prescription/          # Domínio de Prescrições
└── shared/                # Recursos compartilhados
    ├── config/            # Configurações de Ambiente
    ├── database/          # Prisma Service
    ├── decorators/        # Decoradores customizados (Public, IsOwner, ActiveUser)
    ├── filter/            # Exception Filters
    ├── guards/            # JWT, RBAC e Ownership Guards
    ├── hashing/           # Central de Criptografia Baseada em Bcrypt
    ├── interceptors/      # Transformadores de Resposta
    └── types/             # Tipos e Interfaces globais
```

---

## 📂 Configuração

Antes de iniciar, crie um arquivo `.env` na raiz do projeto baseado no `.env_exemple`:

```bash
cp .env_exemple .env
```

Preencha as variáveis de ambiente necessárias:

| Variável | Descrição |
| :--- | :--- |
| `DATABASE_URL` | URL de conexão com o PostgreSQL |
| `JWT_SECRET` | Chave secreta para o JWT Token |
| `JWT_REFRESHSECRET` | Chave secreta para o Refresh Token |
| `PORT` | Porta em que a aplicação será executada (Padrão: 5000) |

---

## ⚙️ Como Executar

### Utilizando Docker (Recomendado)

1. Certifique-se de que o Docker e Docker Compose estão instalados.
2. Execute o comando para subir os serviços:

```bash
docker-compose up -d
```

### Manualmente (Desenvolvimento local)

1. Instale as dependências:
```bash
npm install # ou yarn install
```

2. Certifique-se de que seu banco de dados PostgreSQL está rodando.
3. Sincronize o schema do Prisma com o banco:
```bash
npx prisma migrate dev
```

4. Inicie o servidor em modo de desenvolvimento:
```bash
npm run start:dev
```

---

## 📖 Documentação da API

A documentação interativa da API (Swagger) pode ser acessada em:

👉 **[http://localhost:5000/docs](http://localhost:5000/docs)** (Substitua pela sua porta configurada)

Lá você encontrará todos os endpoints disponíveis, esquemas de dados e poderá testar as rotas diretamente do navegador.

---

## 📜 Referência ao Projeto Original

Este projeto foi inspirado e reimplementado a partir do **Medi-App** desenvolvido na disciplina de **Programação II** da **Faculdade Descomplica**.  
A proposta original tinha como objetivo gerenciar um consultório médico, incluindo médicos, pacientes, consultas e prescrições.

---

## 📫 Contribuindo

1. Faça um Fork do projeto.
2. Crie uma Branch para sua feature (`git checkout -b feature/nova-feature`).
3. Faça o Commit de suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Envie para a Branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

---

## 📝 Licença

Este projeto é destinado a fins educacionais e acadêmicos. Distribuído sob a licença **UNLICENSED**.

---
<p align="center">Desenvolvido por Elias Carlos</p>
