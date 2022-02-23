export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/people",
  port: process.env.PORT || 3333,
  rabbitMQ: process.env.RABBIT_MQ_URL || "amqp://user:1234@localhost:5672"
};
