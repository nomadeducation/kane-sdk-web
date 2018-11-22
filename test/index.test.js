const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Nomad Client", function () {
    it("should retrieve the version", function () {
        const version = Nomad.version();

        expect(version).to.be.an("object").to.include.keys(
            "version",
            "commit"
        );
    });

    it("should monitor the API status", async function () {
        const expectedKeys = [
            "version",
            "cache",
            "internal_apis"
        ];

        const status = await Nomad.health();

        expect(status).to.be.an("object").to.include.keys(...expectedKeys);
    });

    it("should register one user", async function () {
        const fakeUser = {
            email: `dummy.user+${faker.random.uuid()}@nomadeducation.fr`,
            password: faker.internet.password(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName()
        };

        const newUser = await Nomad.register(fakeUser);

        expect(newUser).to.be.an("object").to.include.all.keys(
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "created_at",
            "updated_at"
        );

        // remove the dummy user afterwards
        const apiClient = new Nomad({api_key: account.apiKey});
        const removed = await apiClient.user.remove(newUser.id);
        expect(removed).to.be.a("boolean").that.is.true;
    });

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

        it("should retrieve my own infos", async function () {
            const ownInfos = await client.me();

            expect(ownInfos).to.be.an("object").that.have.any.keys(
                "id",
                "token",
                "roles",
                "permissions",
                "created_at",
                "updated_at"
            );
        });

        it("should create a new user", async function () {
            const fakeUser = {
                email: `dummy.user+${faker.random.uuid()}@nomadeducation.fr`,
                password: faker.internet.password(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName()
            };

            newUser = await client.user.create(fakeUser);

            expect(newUser).to.be.an("object").that.have.any.keys(
                "id",
                "created_at",
                "updated_at"
            );
        });

        it("should test the existence of a new user", async function () {
            const doesExists = await client.user.exists(newUser.id);

            expect(doesExists).to.be.a("boolean").that.is.true;
        });

        it("should update the created user", async function () {
            const fakeInfos = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName()
            };

            const updated = await client.user.update(newUser.id, fakeInfos);

            expect(updated).to.be.a("boolean").that.is.true;
        });

        it("should disable the created user", async function () {
            const disabled = await client.user.disable(newUser.id);

            expect(disabled).to.be.a("boolean").that.is.true;
        });

        it("should delete the created user", async function () {
            const removed = await client.user.remove(newUser.id);

            expect(removed).to.be.a("boolean").that.is.true;
        });

        it("should check that the user doesn't exist", async function () {
            const userId = "42";
            const doesExists = await client.user.exists(userId);

            expect(doesExists).to.be.a("boolean").that.is.false;
        });
    });

    describe("methods as a logged user using the API key", function () {
        // XXX no need to login before
        const {apiKey} = account;

        it("should check that there are some users still there!", async function () {
            const apiClient = new Nomad({api_key: apiKey});
            const {count} = await apiClient.user.metadata();

            expect(count).to.be.a("number").that.is.at.least(1);
        });
    });
});
