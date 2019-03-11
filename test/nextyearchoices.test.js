const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Next year choice", function () {
    const client = new Nomad();
    let newNextYearChoice = {};
    const nextYearChoiceName = `dummy next year choice ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new next year choice", async function () {
        const fakeNextYearChoice = {
            name: nextYearChoiceName
        };

        newNextYearChoice = await client.nextyearchoices.create(fakeNextYearChoice);

        expect(newNextYearChoice).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new next year choice", async function () {
        const doesExists = await client.nextyearchoices.exists(newNextYearChoice.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created next year choice", async function () {
        const fakeInfos = {
            name: `changed ${nextYearChoiceName}`
        };

        const updated = await client.nextyearchoices.update(newNextYearChoice.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created next year choice", async function () {
        const removed = await client.nextyearchoices.remove(newNextYearChoice.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the next year choice doesn't exist", async function () {
        const doesExists = await client.nextyearchoices.exists(newNextYearChoice.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
