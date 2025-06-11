# 🎓 EduAPI

**Modern Learning Management System (LMS)**
_Built with Node.js • Express • TypeScript • PostgreSQL_

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

---

## 🚀 Overview

**EduAPI** is a powerful backend system designed for educational platforms. It offers modular architecture, secure authentication, robust user management, and clean, scalable infrastructure. Built with modern development best practices, it’s a strong foundation for any LMS application.

---

## ⚙️ Features

- 🔐 Secure JWT Authentication (access, refresh, verification, password reset)
- 🧑‍🏫 Role-based Access: Admin, Company, Employee, Individual
- 🏗️ Modular Express Routing System
- 🧰 Global Error Handling & Middleware
- 🚀 Security: Helmet, CORS, Rate Limiting, HPP, Compression
- 📩 Mail configuration support (SMTP-ready)
- 📚 Prisma ORM + PostgreSQL
- 🧪 Clean and maintainable architecture

---

## 🛠️ Tech Stack

**Languages & Core**
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)

**Tools / Libraries**
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Dotenv](https://img.shields.io/badge/Dotenv-000000?style=flat&logo=dotenv&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-000000?style=flat&logo=helmet&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-000000?style=flat&logo=cors&logoColor=white)
![Rate Limit](https://img.shields.io/badge/Rate_Limit-000000?style=flat&logo=express&logoColor=white)
![HPP](https://img.shields.io/badge/HPP-000000?style=flat&logo=express&logoColor=white)
![Compression](https://img.shields.io/badge/Compression-000000?style=flat&logo=express&logoColor=white)

---

## 📂 Project Structure

EDUAPI/
├── .husky/ # Git hooks
├── .vscode/ # VSCode settings
├── docker/ # Docker configurations
├── logs/ # Log files
├── node_modules/ # Dependencies
├── prisma/ # Prisma schema & migrations
│ ├── migrations/
│ └── schema.prisma
├── src/ # Source code
│ ├── configs/ # App-level config (env, db, etc.)
│ ├── constants/ # Static values and enums
│ ├── controllers/ # Route logic controllers
│ ├── middlewares/ # Middleware functions
│ ├── routes/ # API routes
│ ├── services/
│ │ └── emails/ # Email service
│ │ ├── company/
│ │ ├── general/
│ │ ├── templates/ # Email HTML/text templates
│ │ ├── emailSender.ts
│ │ └── emailTransporter.ts
│ ├── types/ # Custom TypeScript types
│ ├── utils/ # Helper utilities
│ ├── validator/ # Zod or Joi validators
│ ├── app.ts # Express app entry
│ └── server.ts # Server bootstrapping
├── .env # Environment variables
├── .dockerignore
├── .eslintignore
├── .gitignore
├── .prettierrc
├── commitlint.config.js
├── eslint.config.mjs
├── nodemon.json
├── package.json
├── package-lock.json
└── README.md

---

## ⚙️ Environment Setup

Create a `.env` file at the root and configure it like this:

```env
PORT=3000
SERVER_URL=http://localhost:3000
DATABASE_URL="postgresql://youruser:yourpassword@localhost:5432/eduapi?schema=public"

ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
VERIFICATION_TOKEN_SECRET="your_verification_token_secret"
FORGET_PASSWORD_TOKEN_SECRET="your_forgot_password_secret"

ACCESS_TOKEN_EXPIRY="60m"
REFRESH_TOKEN_EXPIRY="30d"
VERIFICATION_TOKEN_EXPIRY="2d"
FORGET_PASSWORD_TOKEN_EXPIRY="1d"

MAIL_NAME=your_mail_name
MAIL_HOST=your_mail_host
MAIL_USER=your_mail_user
MAIL_PASSWORD=your_mail_password

---

🧪 Getting Started
```

# 1. Clone the repository

git clone https://github.com/your-username/eduapi.git

# 2. Navigate into the project

cd eduapi

# 3. Install dependencies

npm install

# 4. Generate Prisma client & migrate database

npx prisma generate
npx prisma migrate dev --name init

# 5. Start the development server

## npm run dev

---

🔐 API Routes

| Route Prefix         | Description                   |
| -------------------- | ----------------------------- |
| `/api/v1/auth`       | Authentication & Tokens       |
| `/api/v1/admin`      | Admin-specific endpoints      |
| `/api/v1/company`    | Company account management    |
| `/api/v1/employee`   | Employee-specific features    |
| `/api/v1/individual` | Individual user functionality |

Example Endpoints by Role
👨‍💼 Admin

    POST /api/v1/admin/signup – Create admin

    POST /api/v1/admin/login – Login admin

    PATCH /api/v1/admin/me/change-password – Change password

    GET /api/v1/admin/companies – Get companies

    PATCH /api/v1/admin/companies/:id/change-plan – Change company plan

    GET /api/v1/admin/individuals – View individuals

    DELETE /api/v1/admin/employees/:id – Delete employee

🏢 Company

    POST /api/v1/company/signup – Register company

    POST /api/v1/company/login – Login

    PATCH /api/v1/company/me/change-password – Update password

    GET /api/v1/company/employees – List employees

    POST /api/v1/company/employees – Add employee

👨‍🔧 Employee

    POST /api/v1/employee/login – Login

    GET /api/v1/employee/me – Get profile

    PATCH /api/v1/employee/change-password – Change password

👤 Individual

    POST /api/v1/individual/signup – Register

    POST /api/v1/individual/login – Login

    GET /api/v1/individual/me – Get profile

    PATCH /api/v1/individual/change-password – Change password

---

    🧠 Database Models (Prisma)

Main Prisma models:

    Admin

    Company

    Employee

    Individual

    Course, Video, Assessment

    CompanyContact

Enums used:

    Role (ADMIN, COMPANY, EMPLOYEE, INDIVIDUAL)

    Status (ACTIVE, BLOCKED, INACTIVE)

    PlanType (TRIAL, BASIC, STANDARD, PREMIUM, CUSTOM)

    Departments (e.g., HR, IT, Sales, etc.)

---

🤝 Contributing

```
    Fork the repository

    Create a new branch: git checkout -b feature/your-feature

    Commit your changes: git commit -m 'Add some feature'

    Push to the branch: git push origin feature/your-feature

    Open a pull request

 ---

📃 License

This project is licensed under the MIT License.

---

📫 Contact

Built with ❤️ by Asmare Admasu

```

