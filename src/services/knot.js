const cloud = require('../../config/knot');
const error = require('../utils/error');

async function searchKnotThing(cloud, req, res) {
  const devices = await cloud.getDevices();
  const [device] = devices.filter(
    ({ name }) => name === (req.body.name || req.params.name)
  );
  if (!device) {
    error(res, 'device_not_found');
  }

  return device;
}

async function searchSensor(device, req, res) {
  const thing = await cloud.getData(device.id);
  const sensor = thing.filter(
    ({ data }) =>
      data.sensor_id === (req.body.sensorId || parseInt(req.params.sensorId))
  );

  if (!sensor) {
    error(res, 'sensor_not_found');
  }

  return sensor;
}

module.exports = { searchKnotThing, searchSensor };
