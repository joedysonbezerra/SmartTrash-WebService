module.exports = {
  url: process.env.DATABASE_URL || "mongodb://localhost/knotsoa",
  flag: { useNewUrlParser: "true", useCreateIndex: "true" }
};
