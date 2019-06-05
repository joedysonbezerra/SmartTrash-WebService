const mongoose = require('mongoose');
const Sensor = mongoose.model('Sensor');
const cloud = require('../../config/knot');
const enumMonth = require('../../config/enumMonth');
const moment = require('moment');
const error = require('../utils/error');

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

async function searchKnotThing(cloud, req, res) {
  const devices = await cloud.getDevices();
  const [device] = devices.filter(({ name }) => name === req.body.name);

  if (!device) {
    error(res, 'device_not_found');
  }

  return device;
}

async function searchSensor(device, req, res) {
  const thing = await cloud.getData(device.id);
  const sensor = thing.filter(
    ({ data }) => data.sensor_id === req.body.sensorId
  );

  if (!sensor) {
    error(res, 'sensor_not_found');
  }

  return sensor;
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

async function update(req, res) {
  let dbThing = await Sensor.findOne({
    thingId: req.body.id,
    sensorId: req.body.data.sensor_id,
  });

  dbThing.sensorValue = req.body.data.value;

  if (dbThing.sensorValue === 'true')
    dbThing.monthly[moment().month()].value += 1;

  await dbThing.save();
  res.json(dbThing);
}
module.exports = { create, update };
