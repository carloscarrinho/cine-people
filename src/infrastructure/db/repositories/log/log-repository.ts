import { LogErrorRepository } from '../../../../application/contracts/log/log-error-repository' 
import { MongoHelper } from '../../clients/mongo-helper' 

export class LogMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const errorsCollection = await MongoHelper.getCollection('errors')

    await errorsCollection.insertOne({ stack, date: new Date() })
  }
}
