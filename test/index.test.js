const Nomad = require("dist/test/sdk.node");
const mockServer = require("mockttp").getLocal();
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Nomad Client", function () {
    // use the same port as defined in webpack.test.js
    beforeEach(() => mockServer.start(3333));
    afterEach(() => mockServer.stop());

    it("should retrieve the version", function () {
        const version = Nomad.version();

        expect(version).to.be.an("object").to.include.keys(
            "version",
            "commit"
        );
    });

    it("should monitor the API status", async function () {
        const responseObj = {
            version: "2.0.0",
            internal_apis: [
                {
                    name: "identity",
                    status: "up"
                }
            ]
        };

        await mockServer.get("/v2/health").thenReply(200, JSON.stringify(responseObj));

        const status = await Nomad.health();

        expect(status).to.be.an("object").to.be.deep.equal(responseObj);
    });

    it("should register one user", async function () {
        const fakeUser = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName()
        };

        const responseObj = Object.assign(
            {
                id: "676a14fc-5b67-4462-a1e5-dd4e3208b593",
                created_at: faker.date.recent(),
                updated_at: faker.date.recent()
            },
            fakeUser
        );

        await mockServer.post("/v2/register").thenReply(200, JSON.stringify(responseObj));

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
    });

    describe("methods as a logged user", function () {
        const client = new Nomad();

        beforeEach(async () => {
            await mockServer.post("/v2/login").thenReply(200, "");
            await client.login("ultra-vomit", "0xDEADBEEF");
        });
        afterEach(async () => {
            await mockServer.get("/v2/logout").thenReply(200, "");

            await client.logout();
        });

        it("should fetch user metadata", async function () {
            const count = 1337;

            await mockServer.head("/v2/users").thenReply(200, "", {"Content-Range": `items */${count}`});

            const userCount = await client.user.metadata();

            expect(userCount).to.be.an("object").to.have.property("count").that.is.equal(count);
        });
    });

    describe("methods as a logged user using the API key", function () {
        // XXX no need to login before
        const apiKey = "ec0e4492d8ffb1398af38ce02420f4fc";
        const header = {
            "Authorization": `Bearer ${apiKey}`
        };

        it("should fetch user metadata", async function () {
            const count = 42;

            await mockServer.head("/v2/users")
            .withHeaders(header)
            .thenReply(200, "", {"Content-Range": `items */${count}`});

            const client = new Nomad({api_key: "ec0e4492d8ffb1398af38ce02420f4fc"});
            const userCount = await client.user.metadata();

            expect(userCount).to.be.an("object").to.have.property("count").that.is.equal(count);
        });
    });
});
