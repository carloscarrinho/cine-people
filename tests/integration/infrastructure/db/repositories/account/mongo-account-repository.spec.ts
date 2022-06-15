import { Collection } from "mongodb";
import { MongoHelper } from "../../../../../../src/infrastructure/db/clients/mongo-helper";
import { MongoAccountRepository } from "../../../../../../src/infrastructure/db/repositories/account/mongo-account-repository";
import env from "../../../../../../src/main/config/env";

let accountsCollection: Collection;

const makeSut = (): MongoAccountRepository => {
  return new MongoAccountRepository();
};

describe("Integration", () => {
  describe("Infrastructure", () => {
    describe("DB", () => {
      describe('MongoAccountRepository', () => {
        beforeAll(async () => {
          await MongoHelper.connect(env.mongoUrl)
        })
      
        afterAll(async () => {
          await MongoHelper.disconnect()
        })
      
        beforeEach(async () => {
          accountsCollection = await MongoHelper.getCollection('accounts')
          await accountsCollection.deleteMany({})
        })
      
        describe('store()', () => {
          it('Should return an account on store success', async () => {
            const sut = makeSut()
            const accountData = {
              name: 'any_name',
              email: 'any_email@mail.com',
              password: 'hashed_password'
            }
      
            const account = await sut.store(accountData)
      
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toEqual(accountData.name)
            expect(account.email).toEqual(accountData.email)
            expect(account.password).toEqual(accountData.password)
          })
        })
      
        describe('loadByEmail()', () => {
          it('Should return an account on loadByEmail success', async () => {
            // Given
            const sut = makeSut()
            const accountData = {
              name: 'any_name',
              email: 'any_email@mail.com',
              password: 'hashed_password'
            }
            const { insertedId } = await accountsCollection.insertOne(accountData)
      
            // When
            const account = await sut.loadByEmail(accountData.email)
      
            // Then
            expect(account).toEqual({
              id: insertedId.toString(),
              name: accountData.name,
              email: accountData.email,
              password: accountData.password
            })
          })
      
          it('Should return null if loadByEmail fails', async () => {
            // Given
            const sut = makeSut()
      
            // When
            const account = await sut.loadByEmail('any_email@mail.com')
      
            // Then
            expect(account).toBeFalsy()
          })
        })
      
        describe('updateAccessToken()', () => {
          it('Should update updateAccessToken on database', async () => {
            // Given
            const sut = makeSut()
            const accountData = {
              name: 'any_name',
              email: 'any_email@mail.com',
              password: 'hashed_password'
            }
            const anyToken = 'any_token'
            const { insertedId } = await accountsCollection.insertOne(accountData)
      
            // When
            await sut.updateAccessToken(insertedId.toString(), anyToken)
      
            // Then
            const account = await accountsCollection.findOne({ _id: insertedId })
            expect(account.accessToken).toBeTruthy()
          })
        })
      })
    });
  });
});
