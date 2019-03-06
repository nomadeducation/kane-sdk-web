const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Degree", function () {
    const client = new Nomad();
    let newDegree = {};
    const degreeName = `dummy degree ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new degree", async function () {
        const fakeDegree = {
            name: degreeName
        };

        newDegree = await client.degrees.create(fakeDegree);

        expect(newDegree).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new degree", async function () {
        const doesExists = await client.degrees.exists(newDegree.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created degree", async function () {
        const fakeInfos = {
            name: `changed ${degreeName}`
        };

        const updated = await client.degrees.update(newDegree.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created degree", async function () {
        const removed = await client.degrees.remove(newDegree.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the degree doesn't exist", async function () {
        const doesExists = await client.degrees.exists(newDegree.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
