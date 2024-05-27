import express from "express";
import cors from "cors";
const app = express();
import { Server } from "socket.io";
import { createServer } from "http";

app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected and hid ID: is", socket.id);

  socket.on("user_message", (data) => {
    console.log(data);
    socket.broadcast.emit("user-receive-message", data);
  });

  // group messages
  socket.on("group_message", ({ message, group }) => {
    console.log(message);
    io.to(group).emit("group-receive-message", message);
  });

  // socket.broadcast.emit("welcome", `Welcome to the specific user ${socket.id}`);
  socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(3000, () => {
  console.log("Server is running at port number: 3000");
});
