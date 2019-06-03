module.exports = {
  url: process.env.DATABASE_URL || 'mongodb://localhost/knotsoa',
  flags: { useNewUrlParser: 'true', useCreateIndex: 'true' },
};
