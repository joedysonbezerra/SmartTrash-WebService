const cloud = require('../../config/knot');
const { searchKnotThing, searchSensor } = require('../services/knot');

async function getData(req, res, next) {
  try {
    await cloud.connect();
    const device = await searchKnotThing(cloud, req, res);
    const sensor = await searchSensor(device, req, res);
    res.json(sensor);
  } catch (error) {
    console.log(error);
  } finally {
    await cloud.close();
  }
}

module.exports.getData = getData;
