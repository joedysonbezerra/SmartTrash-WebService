const express = require('express');
const requireDir = require('require-dir');
const controllers = requireDir('./controllers');

const routes = express.Router();

routes.post('/sensor', controllers.sensorController.create);
routes.put('/sensor/update', controllers.sensorController.update);

module.exports = routes;
