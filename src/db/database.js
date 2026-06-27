import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();
const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`,
);
async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    // await sql `ALTER TABLE products ADD COLUMN description TEXT`;
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            userid SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    // await sql`ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'`;
    await sql`
        CREATE TABLE IF NOT EXISTS cart (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(userid),
          product_id INT REFERENCES products(id),
          quantity INT DEFAULT 1,
          UNIQUE (user_id, product_id)
        );
    `;
    //     await sql`
    //   ALTER TABLE orders
    //   ADD COLUMN address_id INT REFERENCES addresses(id);
    // `;
    await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(userid),
          total_price DECIMAL(10, 2),
          status VARCHAR(20) DEFAULT 'pending'
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS order_item(
          id SERIAL PRIMARY KEY,
          order_id INT REFERENCES orders(id),
          product_id INT REFERENCES products(id),
          quantity INT DEFAULT 1
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS addresses (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(userid) ON DELETE CASCADE,
          full_name VARCHAR(150) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          address_line TEXT NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100),
          postal_code VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    // await sql`
    //   ALTER TABLE order_item ADD COLUMN price DECIMAL(10, 2)`;
    await sql`
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(userid) ON DELETE CASCADE, 
          product_id INT REFERENCES products(id) ON DELETE CASCADE,
          rating INT CHECK (rating >= 1 AND rating <= 5),
          comment TEXT, 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing database:", error);
  }
}
export default initDB;
