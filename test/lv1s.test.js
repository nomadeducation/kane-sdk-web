const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("LV1", function () {
    const client = new Nomad();
    let newLV1 = {};
    const lv1Name = `dummy lv1 ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new lv1", async function () {
        const fakeLV1 = {
            name: lv1Name
        };

        newLV1 = await client.lv1s.create(fakeLV1);

        expect(newLV1).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new lv1", async function () {
        const doesExists = await client.lv1s.exists(newLV1.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created lv1", async function () {
        const fakeInfos = {
            name: `changed ${lv1Name}`
        };

        const updated = await client.lv1s.update(newLV1.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created lv1", async function () {
        const removed = await client.lv1s.remove(newLV1.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the lv1 doesn't exist", async function () {
        const doesExists = await client.lv1s.exists(newLV1.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
