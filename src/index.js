const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const Sentry = require('@sentry/node');
const path = require('path');
const dbConfig = require('../config/database');
const sentryConfig = require('../config/sentry');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { origins: '*:*' });
const port = process.env.PORT || 3000;

Sentry.init(sentryConfig);

mongoose.connect(dbConfig.url, dbConfig.flags);

requireDir(path.resolve('src', 'models'));

io.on('connection', socket => {
  console.log('A user is connected');
  socket.on('subscribe', client => {
    console.log(client);
  });
});
app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(cors());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use('/api', require('./routes'));
app.use(Sentry.Handlers.errorHandler());

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
