export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/blogv1",
  mongoUrlTest: process.env.MONGO_URL_TEST || "mongodb://localhost:27017/blogv1_test",
  port: process.env.PORT || 3333,
};
