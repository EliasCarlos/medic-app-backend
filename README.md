# 🩺 Medi-App Backend

Este repositório contém a implementação do backend do **Medi-App**, um sistema para gerenciamento de consultórios médicos, desenvolvido como parte da disciplina de **Programação II** da Faculdade Descomplica.

O projeto foi reestruturado com foco em boas práticas, utilizando **NestJS**, **Prisma ORM** e **Docker**, com autenticação, validação de dados e tratamento global de erros.

---

## 📚 Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** — Framework Node.js progressivo para construção de APIs escaláveis.
- **[TypeScript](https://www.typescriptlang.org/)** — Superset do JavaScript com tipagem estática.
- **[Prisma ORM](https://www.prisma.io/)** — ORM moderno e seguro para manipulação do banco de dados.
- **[PostgreSQL](https://www.postgresql.org/)** — Banco de dados relacional usado no projeto.
- **[Docker](https://www.docker.com/)** — Containerização da aplicação e banco de dados.
- **[Class Validator](https://github.com/typestack/class-validator)** — Validação de dados de entrada via DTOs.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)** — Criptografia de senhas.
- **[Dotenv](https://github.com/motdotla/dotenv)** — Gerenciamento de variáveis de ambiente.

---

## 📂 Estrutura do Projeto

```bash
medic-app-backend/
│   ├── prisma/                # Configuração do schema do Prisma
│   │   └── schema.prisma
│   ├── src/
│   │   ├── appointment/       # Módulo de agendamentos
│   │   ├── doctor/            # Módulo de médicos
│   │   ├── patient/           # Módulo de pacientes
│   │   ├── prescription/      # Módulo de prescrições médicas
│   │   ├── shared/
│   │   │   ├── config/        # Configurações gerais
│   │   │   ├── database/      # Serviço do Prisma e conexões
│   │   │   ├── filter/        # Filtros globais (tratamento de erros)
│   │   │   └── types/         # Tipos globais da aplicação
│   │   ├── app.module.ts      # Módulo raiz
│   │   └── main.ts            # Ponto de entrada da aplicação
│   ├── .env                   # Variáveis de ambiente
│   ├── Dockerfile             # Configuração da imagem Docker
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md              # Este arquivo
```

---

## 💻 Executando o Projeto

### 1️⃣ Pré-requisitos

- Node.js (versão LTS recomendada)
- Docker e Docker Compose
- Yarn ou NPM
- Conta no [Postman](https://www.postman.com/) (opcional para testar as APIs)

### 2️⃣ Passos para execução

```bash
# Clonar o repositório
git clone https://github.com/EliasCarlos/medic-app-backend.git

# Entrar na pasta do backend
cd medic-app-backend

# Instalar dependências
yarn install
# ou
npm install

# Subir os containers
docker-compose up -d

# Rodar as migrations do Prisma
npx prisma migrate dev --name init

# Iniciar o servidor
yarn start:dev
```

O backend estará disponível em: **http://localhost:5000**

---

## 📦 Executando com Docker Compose (opcional)

Caso queira subir apenas o banco de dados com Docker, crie um arquivo `docker-compose.yml` na raiz do projeto com o conteúdo abaixo:

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: medic_app
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

Depois, execute:

```bash
docker-compose up -d
```

---

## 🛠 Funcionalidades

- CRUD completo para **médicos**, **pacientes**, **consultas** e **prescrições**
- Validação de dados de entrada
- Criptografia de senhas
- Tratamento global de erros
- Integração com banco de dados PostgreSQL via Prisma ORM
- Containerização com Docker

---

## 📜 Referência ao Projeto Original

Este projeto foi inspirado e reimplementado a partir do **Medi-App** desenvolvido na disciplina de **Programação II** da Faculdade Descomplica.  
A proposta original tinha como objetivo gerenciar um consultório médico, incluindo médicos, pacientes, consultas e prescrições.

---

## 📫 Contribuindo



---

## 📝 Licença

Este projeto é de uso acadêmico e foi criado para fins educacionais.
