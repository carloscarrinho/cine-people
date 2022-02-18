export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/blogv1",
  mongoUrlTest: process.env.MONGO_URL_TEST || "mongodb://localhost:27017/blogv1_test",
  port: process.env.PORT || 3333,
  rabbitMQ: process.env.RABBIT_MQ_URL || "amqp://user:1234@localhost:5672"
};
