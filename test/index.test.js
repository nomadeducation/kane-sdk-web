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
            "db",
            "db_schema"
        ];

        const status = await Nomad.health();

        expect(status).to.be.an("object").to.include.any.keys(...expectedKeys);
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
            "token",
            "created_at"
        );

        // remove the dummy user afterwards
        const client = new Nomad();
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
        const removed = await client.users.remove(newUser.id);
        expect(removed).to.be.a("boolean").that.is.true;
        await client.logout();
    });

    describe("methods as a logged user", function () {
        const client = new Nomad();

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
    });

    describe("Error handling", function () {
        it("should execute the handler when requesting an unreachable resource", async function () {
            const client = new Nomad({
                error_handler (err) {
                    expect(err).to.be.an("object").that.have.any.keys(
                        "code",
                        "message",
                        "details"
                    );
                }
            });

            await client.me();
        });
    });
});
