const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  thingId: {
    type: String,
    required: true,
  },
  sensorId: {
    type: Number,
    required: true,
  },
  sensorValue: {
    type: String,
    required: true,
  },
  monthly: {
    type: [
      {
        name: {
          type: String,
          default: '',
        },
        value: {
          type: Number,
          default: 0,
        },
      },
    ],
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('Sensor', sensorSchema);
