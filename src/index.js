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
      // "http://127.0.0.1:5500"
    ],
    credentials: true
  }
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

initDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});