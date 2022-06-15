import { AccountModel } from "../../../../../src/application/usecases/add-account/add-account";
import { DbAddAccount } from "../../../../../src/application/usecases/add-account/db-add-account";
import { Account } from "../../../../../src/domain/entities/account";
import { Hasher } from "../../../../../src/application/contracts/cryptography/hasher";
import { AccountRepository } from "../../../../../src/infrastructure/db/repositories/account/account-repository";

const makeSut = ({ store, hash }: { store?: Function; hash?: Function }): DbAddAccount => {
  const hasher = {
    hash: hash ?? jest.fn().mockResolvedValue("hashed_password"),
  } as unknown as Hasher;

  const accountRepository = {
    store: store ?? jest.fn(),
  } as unknown as AccountRepository;

  return new DbAddAccount(hasher, accountRepository);
};

const makeAccountModel = (data?: object): AccountModel => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
  ...data,
});

const makeAccount = (data?: object): Account => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
  ...data,
});

describe("Unit", () => {
  describe("Application", () => {
    describe("Usecases: AddAccount", () => {
      describe("DbAddAccount", () => {
        it("Should call Hasher with the provided password", async () => {
          // Given
          const dependencies = { hash: jest.fn() };
          const dbAddAccount = makeSut(dependencies);
          const accountModel = makeAccountModel();

          // when
          await dbAddAccount.add(accountModel);

          // Then
          expect(dependencies.hash).toHaveBeenCalledWith(accountModel.password);
        });

        it("Should throw an error if Hasher throws", async () => {
          // Given
          const dependencies = {
            hash: jest.fn().mockImplementationOnce(() => {
              throw new Error();
            }),
          };
          const dbAddAccount = makeSut(dependencies);

          // When
          const account = dbAddAccount.add(makeAccountModel());

          // Then
          expect(account).rejects.toThrow();
        });

        it("Should call AccountRepository with correct values", async () => {
          // Given
          const hashedPassword = "hashed_password";
          const dependencies = {
            hash: jest.fn().mockResolvedValue(hashedPassword),
            store: jest.fn(),
          };
          const dbAddAccount = makeSut(dependencies);
          const accountModel = makeAccountModel();

          // When
          await dbAddAccount.add(accountModel);

          // Then
          expect(dependencies.store).toHaveBeenCalledWith({
            ...accountModel,
            password: hashedPassword,
          });
        });

        it("Should throw an error if AccountRepository throws", async () => {
          // Given
          const dependencies = {
            store: jest.fn().mockImplementationOnce(() => {
              throw new Error();
            }),
          };
          const dbAddAccount = makeSut(dependencies);

          // When
          const account = dbAddAccount.add(makeAccountModel());

          // Then
          expect(account).rejects.toThrow();
        });

        it("Should return an Account if store succeeds", async () => {
          // Given
          const accountModel = makeAccountModel();
          const expectedAccount = makeAccount();
          const dependencies = {
            store: jest.fn().mockResolvedValueOnce(expectedAccount),
          };
          const dbAddAccount = makeSut(dependencies);

          // When
          const account = await dbAddAccount.add(accountModel);

          // Then
          expect(account).toStrictEqual(expectedAccount);
        });
      });
    });
  });
});
