import env from "./config/env";
import { MongoHelper } from "../infrastructure/db/clients/mongo-helper";
import { RabbitMQHelper } from "../infrastructure/message-broker/clients/rabbitmq-helper";

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    RabbitMQHelper.connect(env.rabbitMQ);
    const app = (await import("./config/app")).default;
    app.listen(env.port, () => console.log(`App running at http://localhost:${env.port}`));
  })
  .catch(console.error);
