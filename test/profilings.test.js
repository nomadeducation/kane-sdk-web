const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Profilings", function () {
    const client = new Nomad();
    let newProfiling = {};
    const profilingName = `dummy profiling ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new profiling", async function () {
        const fakeProfiling = {name: profilingName};

        newProfiling = await client.profilings.create(fakeProfiling);

        expect(newProfiling).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new profiling", async function () {
        const doesExists = await client.profilings.exists(newProfiling.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created profiling", async function () {
        const fakeInfos = {
            name: `changed ${profilingName}`
        };

        const updated = await client.profilings.update(newProfiling.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created profiling", async function () {
        const removed = await client.profilings.remove(newProfiling.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the profiling doesn't exist", async function () {
        const doesExists = await client.profilings.exists(newProfiling.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
