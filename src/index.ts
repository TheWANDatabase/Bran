import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import cors from "cors";
import "dotenv/config"
import { apiRouter } from "./api";

const app = express.default();

app.use(cors())
app.use(express.json());

app.get("/", (_req, res) => {
  res.send({ uptime: process.uptime() });
});

app.use('/', apiRouter)


const server = http.createServer(app);
const io = new socketio.Server(server);

io.on("connection", (...params: any) => {
  console.log(params);
});



server.listen(process.env.PORT, () => {
  console.log(`TWDB/Bran is available at ${process.env.HOST}:${process.env.PORT}`);
});