let io;

export const initSocket = (server) => {
  const { Server } = await import("socket.io");

  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL,
      ],
      credentials: true
    }
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};