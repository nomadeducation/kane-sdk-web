const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("OptionalSubject", function () {
    const client = new Nomad();
    let newOptionalSubject = {};
    const optionalsubjectName = `dummy optionalsubject ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new optionalsubject", async function () {
        const fakeOptionalSubject = {
            name: optionalsubjectName
        };

        newOptionalSubject = await client.optionalsubjects.create(fakeOptionalSubject);

        expect(newOptionalSubject).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new optionalsubject", async function () {
        const doesExists = await client.optionalsubjects.exists(newOptionalSubject.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created optionalsubject", async function () {
        const fakeInfos = {
            name: `changed ${optionalsubjectName}`
        };

        const updated = await client.optionalsubjects.update(newOptionalSubject.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created optionalsubject", async function () {
        const removed = await client.optionalsubjects.remove(newOptionalSubject.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the optionalsubject doesn't exist", async function () {
        const doesExists = await client.optionalsubjects.exists(newOptionalSubject.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
