const express = require("express");
const requireDir = require("require-dir");
const controller = requireDir("./controllers");

const routes = express.Router();

routes.post("/sensor", controller.sensorController.create);

module.exports = routes;
