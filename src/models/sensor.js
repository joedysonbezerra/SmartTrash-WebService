const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  thingId: {
    type: String,
    required: true
  },
  sensorId: {
    type: Number,
    required: true
  },
  sensorValue: {
    type: String,
    required: true
  },
  valueGraph: {
    type: []
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("Sensor", sensorSchema);
