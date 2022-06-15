import env from '../../../../../src/main/config/env'
import { MongoHelper as sut } from '../../../../../src/infrastructure/db/clients/mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if MongoDB is down', async () => {
    const acccountCollection = sut.getCollection('accounts')
    expect(acccountCollection).toBeTruthy()
    await sut.disconnect()
    expect(acccountCollection).toBeTruthy()
  })
})
