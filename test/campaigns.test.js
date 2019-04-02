const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Campaign", function () {
    const client = new Nomad();
    let newCampaign = {};
    const campaignName = `dummy campaign ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new campaign", async function () {
        const fakeCampaign = {
            name: campaignName
        };

        newCampaign = await client.campaigns.create(fakeCampaign);

        expect(newCampaign).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new campaign", async function () {
        const doesExists = await client.campaigns.exists(newCampaign.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created campaign", async function () {
        const fakeInfos = {
            name: `changed ${campaignName}`
        };

        const updated = await client.campaigns.update(newCampaign.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created campaign", async function () {
        const removed = await client.campaigns.remove(newCampaign.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the campaign doesn't exist", async function () {
        const doesExists = await client.campaigns.exists(newCampaign.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
