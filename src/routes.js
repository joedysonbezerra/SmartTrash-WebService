const express = require('express');
const requireDir = require('require-dir');
const controllers = requireDir('./controllers');

const routes = express.Router();

routes.post('/sensor', controllers.sensorController.create);
routes.post('/air', controllers.airConditionerController.update);

module.exports = routes;
