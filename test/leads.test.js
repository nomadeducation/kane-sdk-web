const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Lead", function () {
    const client = new Nomad();
    let newLead = {};
    const leadName = `dummy lead ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new lead", async function () {
        const fakeLead = {
            name: leadName
        };

        newLead = await client.leads.create(fakeLead);

        expect(newLead).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new lead", async function () {
        const doesExists = await client.leads.exists(newLead.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created lead", async function () {
        const fakeInfos = {
            name: `changed ${leadName}`
        };

        const updated = await client.leads.update(newLead.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created lead", async function () {
        const removed = await client.leads.remove(newLead.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the lead doesn't exist", async function () {
        const doesExists = await client.leads.exists(newLead.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
