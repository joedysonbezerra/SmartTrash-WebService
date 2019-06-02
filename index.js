const express = require("express");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const path = require("path");
const dbConfig = require("./config/database.json");
const sentryConfig = require("./config/sentry");
const app = express();
const cors = require("cors");

Sentry.init(sentryConfig);

mongoose.connect(dbConfig.url, dbConfig.flag);

const models = path.resolve("src", "models");
requireDir(models);

app.use(cors());

app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use("/api", require("./src/routes"));
app.use(Sentry.Handlers.errorHandler());

app.listen(3080, () => {
  console.log("Servidor Iniciado");
});
