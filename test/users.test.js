const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("User", function () {
    describe("methods as a logged user", function () {
        const client = new Nomad();
        let newUser = {};

        before(async () => {
            const isConnected = await client.login(account.username, account.password);
            expect(isConnected).to.be.true;
        });

        after(async () => {
            const loggedOut = await client.logout();
            expect(loggedOut).to.be.true;
        });

        it("should create a new user", async function () {
            const fakeUser = {
                email: `dummy.user+${faker.random.uuid()}@nomadeducation.fr`,
                password: faker.internet.password(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName()
            };

            newUser = await client.users.create(fakeUser);

            expect(newUser).to.be.an("object").that.include.all.keys(
                "id",
                "created_at"
            );
        });

        it("should test the existence of the new user", async function () {
            const doesExists = await client.users.exists(newUser.id);

            expect(doesExists).to.be.a("boolean").that.is.true;
        });

        it("should update the created user", async function () {
            const fakeInfos = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName()
            };

            const updated = await client.users.update(newUser.id, fakeInfos);

            expect(updated).to.be.a("boolean").that.is.true;
        });

        it("should disable the created user", async function () {
            const disabled = await client.users.disable(newUser.id);

            expect(disabled).to.be.a("boolean").that.is.true;
        });

        it("should delete the created user", async function () {
            const removed = await client.users.remove(newUser.id);

            expect(removed).to.be.a("boolean").that.is.true;
        });

        it("should check that the user doesn't exist", async function () {
            const userId = "42";
            const doesExists = await client.users.exists(userId);

            expect(doesExists).to.be.a("boolean").that.is.false;
        });
    });
});
