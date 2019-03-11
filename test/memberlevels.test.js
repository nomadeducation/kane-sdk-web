const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Member level", function () {
    const client = new Nomad();
    let newMemberLevel = {};
    const memberLevelName = `dummy member level ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new member level", async function () {
        const fakeMemberLevel = {
            name: memberLevelName,
            number: 666,
            minimum_points: 6660
        };

        newMemberLevel = await client.memberlevels.create(fakeMemberLevel);

        expect(newMemberLevel).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new member level", async function () {
        const doesExists = await client.memberlevels.exists(newMemberLevel.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created member level", async function () {
        const fakeInfos = {
            name: `changed ${memberLevelName}`
        };

        const updated = await client.memberlevels.update(newMemberLevel.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created member level", async function () {
        const removed = await client.memberlevels.remove(newMemberLevel.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the member level doesn't exist", async function () {
        const doesExists = await client.memberlevels.exists(newMemberLevel.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
