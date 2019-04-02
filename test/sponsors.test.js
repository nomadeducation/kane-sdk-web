const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Sponsor", function () {
    const client = new Nomad();
    let newSponsor = {};
    const fakeName = `dummy sponsor ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new sponsor", async function () {
        const fakeSponsor = {
            name: fakeName
        };

        newSponsor = await client.sponsors.create(fakeSponsor);

        expect(newSponsor).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new sponsor", async function () {
        const doesExists = await client.sponsors.exists(newSponsor.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created sponsor", async function () {
        const fakeInfos = {
            name: `changed ${fakeName}`
        };

        const updated = await client.sponsors.update(newSponsor.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should list options of the created sponsor", async function () {
        const options = await client.sponsors.listOptions(newSponsor.id);

        expect(options).to.be.an("array").that.is.empty;
    });

    it("should delete the created sponsor", async function () {
        const removed = await client.sponsors.remove(newSponsor.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the sponsor doesn't exist", async function () {
        const doesExists = await client.sponsors.exists(newSponsor.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
