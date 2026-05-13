import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import initDB from "./db/database.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL, // 👈 add this
    ],
    credentials: true,
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

async function startServer() {
  try {
    await initDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server is running on port " + PORT);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
