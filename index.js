import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
const ORIGIN = process.env.ORIGIN || "*"; // Allow all origins by default

// Middleware
app.use(cors({ origin: ORIGIN }));
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    methods: ["GET", "POST"],
  },
});

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// HTTP POST endpoint for broadcasting reservation updates
app.post("/broadcast", (req, res) => {
  const tableData = req.body;
  io.emit("reservation:update", tableData);
  console.log("Broadcasted reservation update");
  res.sendStatus(200);
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);
});
