module.exports = {
  url:
    process.env.DATABASE_URL ||
    'mongodb://joedyson:smartlab2708@ds231307.mlab.com:31307/smart-trash',
  flags: { useNewUrlParser: 'true', useCreateIndex: 'true' },
};
