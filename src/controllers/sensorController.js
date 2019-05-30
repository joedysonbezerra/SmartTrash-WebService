const mongoose = require("mongoose");
const Sensor = mongoose.model("Sensor");
const cloud = require("../../config/knot");

module.exports = {
  async create(req, res, next) {
    try {
      await cloud.connect();
      const devices = await cloud.getDevices();
      const [device] = devices.filter(({ name }) => name === req.body.name);
      if (!device) {
        res.status(500).send("Essa Thing não existe");
      }
      const thing = await cloud.getData(device.id);
      const sensor = thing.filter(
        ({ data }) => data.sensor_id === req.body.sensorId
      );

      if (!sensor) {
        res.status(500).send("Esse sensor na Thing escolhida não existe");
      }
      let dbThing = await Sensor.findOne({
        thingId: device.id,
        sensorId: sensor[0].data.sensor_id
      });

      if (!dbThing) {
        dbThing = await Sensor.create({
          thingId: device.id,
          sensorId: sensor[0].data.sensor_id,
          sensorValue: sensor[0].data.value
        });
      } else {
        dbThing.valueGraph.push(sensor[0].data.value);
        await dbThing.save();
      }

      res.json(dbThing);
    } catch (e) {
      console.log(e);
    } finally {
      await cloud.close();
    }
  }
};
