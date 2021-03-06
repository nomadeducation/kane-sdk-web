const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("App", function () {
    const client = new Nomad();
    let newApp = {};
    const appName = `dummy app ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new app", async function () {
        const fakeApp = {
            name: appName
        };

        newApp = await client.apps.create(fakeApp);

        expect(newApp).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new app", async function () {
        const doesExists = await client.apps.exists(newApp.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created app", async function () {
        const fakeInfos = {
            name: `changed ${appName}`
        };

        const updated = await client.apps.update(newApp.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created app", async function () {
        const removed = await client.apps.remove(newApp.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the app doesn't exist", async function () {
        const doesExists = await client.apps.exists(newApp.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
