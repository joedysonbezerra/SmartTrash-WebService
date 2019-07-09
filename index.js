const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const Sentry = require('@sentry/node');
const path = require('path');
const dbConfig = require('./config/database');
const sentryConfig = require('./config/sentry');
const cors = require('cors');
const cloud = require('./config/knot');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { origins: '*:*' });
const port = process.env.PORT || 3002;
Sentry.init(sentryConfig);

mongoose.connect(dbConfig.url, dbConfig.flags);

requireDir(path.resolve('src', 'models'));

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(cors());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use('/api', require('./src/routes'));
app.use(Sentry.Handlers.errorHandler());

const { update } = require('./src/controllers/trash');
io.on('connection', async socket => {
  console.log(`A user is connected ${socket.id}`);

  socket.on('subscribe', async data => {
    const { thingId, sensorId } = data;
    const event = thingId + sensorId;
    try {
      await cloud.connect();
      await cloud.subscribe(thingId);
      cloud.on(async sensor => {
        if (sensor.data.sensor_id === sensorId) {
          const response = await update(sensor.source, sensor.data);
          io.emit(event, response);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on('energy', async data => {
    const { thingId, sensorId } = data;
    const event = thingId + sensorId;
    try {
      await cloud.connect();
      await cloud.subscribe(thingId);
      cloud.on(async sensor => {
        if (sensor.data.sensor_id === sensorId) {
          io.emit(event, sensor);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
