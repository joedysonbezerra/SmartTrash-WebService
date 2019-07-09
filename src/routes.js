const express = require('express');
const requireDir = require('require-dir');
const controllers = requireDir('./controllers');

const routes = express.Router();

routes.get('/energy/:name/:sensorId', controllers.energy.getData);
routes.post('/sensor', controllers.trash.create);
routes.post('/air', controllers.airConditioner.update);

module.exports = routes;
