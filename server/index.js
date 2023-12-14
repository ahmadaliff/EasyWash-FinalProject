require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const routes = require("./routers/index");
const socketIoMiddleware = require("./middleware/socketIoMiddleware");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_HOST],
  },
});

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(socketIoMiddleware(io));
app.use("/api", routes);

server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
