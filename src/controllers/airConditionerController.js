const cloud = require('../../config/knot');

async function update(req, res) {
  let on_off = 0;
  let temperature = 0;
  try {
    let _value = req.body.value;
    await cloud.connect();
    const devices = await cloud.getDevices();
    const [device] = devices.filter(({ name }) => name === req.body.name);
    await cloud.setData(device.id, [{ sensorId: 1, value: _value }]);

    _value > 1 ? (temperature = _value) : (on_off = _value);

    res.json({
      on_off: on_off,
      temperature: temperature,
    });
  } catch (e) {
    console.log('Remote Control -> err : '.e);
  } finally {
    await cloud.close();
  }
}

module.exports.update = update;
