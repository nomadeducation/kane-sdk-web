const nomad = require("dist/test/sdk.node")();
const mockServer = require("mockttp").getLocal();
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Identity", function () {
    // use the same port as defined in webpack.test.js
    beforeEach(() => mockServer.start(3333));
    afterEach(() => mockServer.stop());

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

        const newUser = await nomad.register(fakeUser);
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
});
