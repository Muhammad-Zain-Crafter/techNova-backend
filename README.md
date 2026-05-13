# 🚀 TechNova Backend

TechNova Backend is a backend system for an online tech products store. It is built using Node.js and Express.js and provides secure, scalable, and real-time features for an e-commerce platform.

---

## 📌 Features

- 🛒 Product management system
- 📦 Order creation and tracking
- 🔄 Real-time updates using Socket.IO
- 🔐 Security layer using Arcjet
- 🗄️ PostgreSQL database integration
- ⚡ RESTful API architecture

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Real-time Communication:** Socket.IO
- **Security:** Arcjet
- **API Type:** REST API

---

## 📡 Real-Time Features

Socket.IO is used to handle real-time communication such as:
- Order status updates
- Admin notifications
- Live user interactions

---

## 🗄️ Database

PostgreSQL is used for storing:
- Users
- Products
- Orders
- Transaction data

---

## 🔐 Security

Arcjet is integrated to protect the backend from:
- Bots
- Abuse requests
- Suspicious traffic patterns

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/technova-backend.git
```
### 2. Install dependencies
```bash
npm install
```
### 3. Setup environment variables
Create a .env file and add:
```bash
PGUSER=******
PGPASSWORD=*******
PGHOST=*******
PGDATABASE=****
ARCJET_ENV=development
ARCJET_KEY=your_arcjet_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=jwt_expiry
CLIENT_URL=client_url
```
