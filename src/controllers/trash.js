const mongoose = require('mongoose');
const Sensor = mongoose.model('Sensor');
const cloud = require('../../config/knot');
const enumMonth = require('../../config/enumMonth');
const moment = require('moment');
const { searchKnotThing, searchSensor } = require('../services/knot');

async function create(req, res) {
  try {
    await cloud.connect();
    const device = await searchKnotThing(cloud, req, res);
    const sensor = await searchSensor(device, req, res);
    const dbThing = await createDB(device.id, sensor);

    res.json(dbThing);
  } catch (e) {
    console.log(e);
  } finally {
    await cloud.close();
  }
}
async function createDB(id, sensor) {
  let dbThing = await Sensor.findOne({
    thingId: id,
    sensorId: sensor[0].data.sensor_id,
  });

  if (!dbThing) {
    dbThing = await Sensor.create({
      thingId: id,
      sensorId: sensor[0].data.sensor_id,
      sensorValue: sensor[0].data.value,
      monthly: enumMonth,
    });
  }

  return dbThing;
}

async function update(id, data) {
  let dbThing = await Sensor.findOne({
    thingId: id,
    sensorId: data.sensor_id,
  });

  dbThing.sensorValue = data.value;

  if (dbThing.sensorValue === 'true')
    dbThing.monthly[moment().month()].value += 1;

  dbThing.quantityCurrent = dbThing.monthly[moment().month()].value;
  await dbThing.save();
  return dbThing;
}

module.exports = { create, update };
