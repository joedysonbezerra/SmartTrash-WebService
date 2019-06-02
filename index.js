const express = require("express");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const Sentry = require("@sentry/node");
const path = require("path");
const dbConfig = require("./config/database");
const sentryConfig = require("./config/sentry");
const cors = require("cors");
const app = express();

Sentry.init(sentryConfig);

mongoose.connect(dbConfig.url, dbConfig.flag);

const models = path.resolve("src", "models");
requireDir(models);

app.use(cors());

app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use("/api", require("./src/routes"));
app.use(Sentry.Handlers.errorHandler());

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor Iniciado");
});
