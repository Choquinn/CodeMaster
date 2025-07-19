# Plataforma de Cursos Online
Sistema de cursos com autenticação de usuários e CRUD de cursos, desenvolvido por Choquinn como projeto de portfólio.

# Tecnologias
Backend: Node.js, Express, MongoDB

Frontend: HTML, CSS, JavaScript

# Como usar
Instale `Node.js` e `MongoDB`

Clone o repositório:
```
git clone https://github.com/Choquinn/curso-backend-portfolio.git
cd curso-backend-portfolio
npm install
```

Crie um arquivo .env com:

```
MONGODB_URI=mongodb://localhost:27017/cursos
JWT_SECRET=sua_chave_secreta
```
Execute:

`npm run dev`
Abra frontend/index.html no navegador.

# Endpoints
POST /api/auth/register - Registrar usuário

POST /api/auth/login - Fazer login

GET /api/cursos - Listar cursos

POST /api/cursos - Criar curso (admin)
