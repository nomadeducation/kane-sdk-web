const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Commercial Interest", function () {
    const client = new Nomad();
    let newCommercialInterest = {};
    const commercialInterestName = `dummy commercial interest ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new commercial interest", async function () {
        const fakeCommercialInterest = {
            name: commercialInterestName
        };

        newCommercialInterest = await client.commercialinterests.create(fakeCommercialInterest);

        expect(newCommercialInterest).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new commercial interest", async function () {
        const doesExists = await client.commercialinterests.exists(newCommercialInterest.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created commercial interest", async function () {
        const fakeInfos = {
            name: `changed ${commercialInterestName}`
        };

        const updated = await client.commercialinterests.update(newCommercialInterest.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created commercial interest", async function () {
        const removed = await client.commercialinterests.remove(newCommercialInterest.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the commercial interest doesn't exist", async function () {
        const doesExists = await client.commercialinterests.exists(newCommercialInterest.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
