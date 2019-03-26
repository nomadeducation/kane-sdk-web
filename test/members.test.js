const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Members", function () {
    const client = new Nomad();
    let newMember = {};
    const memberAddress = `dummy member address ${faker.address.streetAddress()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new member", async function () {
        const fakePost = {address: memberAddress};

        newMember = await client.members.create(fakePost);

        expect(newMember).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new member", async function () {
        const doesExists = await client.members.exists(newMember.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created member", async function () {
        const fakeInfos = {address: `changed ${memberAddress}`};

        const updated = await client.members.update(newMember.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created member", async function () {
        const removed = await client.members.remove(newMember.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the member doesn't exist", async function () {
        const doesExists = await client.members.exists(newMember.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
