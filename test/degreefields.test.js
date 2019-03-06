const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Degree field", function () {
    const client = new Nomad();
    let newDegreeField = {};
    const degreeFieldName = `dummy degree field ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new degree field", async function () {
        const fakeDegreeField = {
            name: degreeFieldName
        };

        newDegreeField = await client.degreefields.create(fakeDegreeField);

        expect(newDegreeField).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new degree field", async function () {
        const doesExists = await client.degreefields.exists(newDegreeField.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created degree field", async function () {
        const fakeInfos = {
            name: `changed ${degreeFieldName}`
        };

        const updated = await client.degreefields.update(newDegreeField.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created degree field", async function () {
        const removed = await client.degreefields.remove(newDegreeField.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the degree field doesn't exist", async function () {
        const doesExists = await client.degreefields.exists(newDegreeField.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
