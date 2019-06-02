const express = require("express");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const Sentry = require("@sentry/node");
const path = require("path");
const dbConfig = require("./config/database");
const sentryConfig = require("./config/sentry");
//const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.origins(["http://192.168.0.120:3002/"]);
Sentry.init(sentryConfig);

mongoose.connect(dbConfig.url, dbConfig.flag);

const models = path.resolve("src", "models");
requireDir(models);

//app.use(cors());

app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use("/api", require("./src/routes"));
app.use(Sentry.Handlers.errorHandler());

io.on("connection", socket => {
  console.log("A user connected");
  socket.on("subscribe", client => {
    console.log(client);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Servidor Iniciado");
});
