# 🚀 TechNova Backend

TechNova Backend is the server-side application powering the **TechNova Tech Store**. It provides secure authentication, product and order management, user reviews, real-time communication, and a RESTful API for the frontend application.

Built with **Node.js**, **Express.js**, and **PostgreSQL**, the backend follows a scalable architecture with modern security practices and real-time capabilities.

---

# ✨ Features

## 👤 Authentication & Authorization

* 🔐 JWT-based authentication
* 🔑 Secure password hashing using bcrypt
* 🛡️ Protected routes with middleware
* 👨‍💼 Role-based authorization (Admin & User)

---

## 🛍️ Product Management

* Create products
* Retrieve products
* Update product details
* Delete products
* Search products
* Filter products by category

---

## 📦 Order Management

* Create new orders
* Retrieve user orders
* Retrieve all orders (Admin)
* Update order status
* Order history

---

## ⭐ Review System

* Users can add product reviews
* Retrieve product reviews
* Calculate average product ratings

---

## 👥 User Management

* User registration
* User login
* User profile management
* Admin user management

---

## 🔄 Real-Time Features

* WebSockets using Socket.IO
* Real-time order status updates
* Live admin notifications
* Instant communication between client and server

---

## 🛡️ Security Features

* JWT Authentication
* Password hashing with bcrypt
* API Rate Limiting
* CORS protection
* Environment variable configuration using dotenv
* Input validation
* Secure HTTP middleware

---

# ⚡ REST API

The backend exposes RESTful APIs for:

* Authentication
* Users
* Products
* Orders
* Reviews
* Admin operations

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## Authentication

* JWT (JSON Web Token)
* bcrypt

## Security

* Express Rate Limit
* CORS
* dotenv

## Real-Time Communication

* Socket.IO (WebSockets)

---

# 📁 Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── database/
│   ├── utils/
│   └── index.js
│
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/technova-backend.git
cd technova-backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

RATE_LIMIT_WINDOW_MS=900000

RATE_LIMIT_MAX_REQUESTS=100
```

---

## 4. Start the Development Server

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

---

# 📡 Real-Time Communication

Socket.IO is used to provide real-time functionality, including:

* Order status updates
* Live admin notifications
* Instant client-server communication

---

# 🗄️ Database

PostgreSQL stores:

* Users
* Products
* Categories
* Orders
* Cart
* Reviews

---

# 🔐 Security

The backend implements several security best practices:

* JWT Authentication
* Password hashing with bcrypt
* Protected API routes
* API Rate Limiting
* Environment variables with dotenv
* CORS configuration
* Role-based authorization

---

# 📌 Future Improvements

* Payment gateway integration
* Email verification
* Password reset via email
* Wishlist API
* Inventory management
* Sales analytics
* Docker support
* Automated testing
