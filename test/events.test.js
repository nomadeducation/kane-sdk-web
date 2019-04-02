const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Event", function () {
    const client = new Nomad();
    let newEvent = {};
    const eventName = `dummy event ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new event", async function () {
        const fakeEvent = {
            title: eventName
        };

        newEvent = await client.events.create(fakeEvent);

        expect(newEvent).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new event", async function () {
        const doesExists = await client.events.exists(newEvent.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created event", async function () {
        const fakeInfos = {
            title: `changed ${eventName}`
        };

        const updated = await client.events.update(newEvent.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created event", async function () {
        const removed = await client.events.remove(newEvent.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the event doesn't exist", async function () {
        const doesExists = await client.events.exists(newEvent.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
