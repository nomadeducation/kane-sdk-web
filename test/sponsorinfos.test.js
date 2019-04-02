const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Sponsor Info", function () {
    const client = new Nomad();
    let newSponsorInfo = {};
    const sponsorInfoName = `dummy sponsor info ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new sponsorinfo", async function () {
        const fakeSponsorInfo = {
            title: sponsorInfoName
        };

        newSponsorInfo = await client.sponsorinfos.create(fakeSponsorInfo);

        expect(newSponsorInfo).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new sponsorinfo", async function () {
        const doesExists = await client.sponsorinfos.exists(newSponsorInfo.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created sponsorinfo", async function () {
        const fakeInfos = {
            title: `changed ${sponsorInfoName}`
        };

        const updated = await client.sponsorinfos.update(newSponsorInfo.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created sponsorinfo", async function () {
        const removed = await client.sponsorinfos.remove(newSponsorInfo.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the sponsorinfo doesn't exist", async function () {
        const doesExists = await client.sponsorinfos.exists(newSponsorInfo.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
