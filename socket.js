
const jwt = require("jsonwebtoken");
const Admin = require("./admin/model/admin.model"); 

let io;
const connectedUsers = new Map(); // socketId -> { userId, roleName }

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication error: Token required"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Admin.findById(decoded.id);

        if (!user) {
          return next(new Error("Authentication error: User not found"));
        }

        socket.user = {
          id: user._id.toString(),
          roleName: user.roleName,
        };

        next();
      } catch (err) {
        console.error("Socket auth error:", err.message);
        return next(new Error("Authentication error"));
      }
    });

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Store user after authentication
      connectedUsers.set(socket.id, {
        userId: socket.user.id,
        roleName: socket.user.roleName,
      });

      socket.on("disconnect", () => {
        connectedUsers.delete(socket.id);
        console.log("Client disconnected:", socket.id);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },

  getUsersByRoles: (roles = []) => {
    const sockets = [];
    for (let [socketId, userData] of connectedUsers.entries()) {
      if (roles.includes(userData.roleName)) {
        sockets.push(socketId);
      }
    }
    return sockets;
  },
};
