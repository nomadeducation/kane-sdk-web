const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Sponsor Form", function () {
    const client = new Nomad();
    let newSponsorForm = {};
    const sponsorformName = `dummy sponsor form ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new sponsorform", async function () {
        const fakeSponsorForm = {
            title: sponsorformName
        };

        newSponsorForm = await client.sponsorforms.create(fakeSponsorForm);

        expect(newSponsorForm).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new sponsorform", async function () {
        const doesExists = await client.sponsorforms.exists(newSponsorForm.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created sponsorform", async function () {
        const fakeInfos = {
            title: `changed ${sponsorformName}`
        };

        const updated = await client.sponsorforms.update(newSponsorForm.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created sponsorform", async function () {
        const removed = await client.sponsorforms.remove(newSponsorForm.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the sponsorform doesn't exist", async function () {
        const doesExists = await client.sponsorforms.exists(newSponsorForm.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
