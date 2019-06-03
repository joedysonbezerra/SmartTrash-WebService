const status = {
  device_not_found: 404,
  sensor_not_found: 404,
  internal_error: 500,
};

const error = (res, code) => {
  res.status(status[code] || 400).send(code);
};

module.exports = error;
