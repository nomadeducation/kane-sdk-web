const Nomad = require("dist/node");
const account = require("./account");
const chai = require("chai");
const expect = chai.expect;

describe("Permission", function () {
    const client = new Nomad();
    let onePermission = {};

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should check that there're existing permissions", async function () {
        const infos = await client.permissions.metadata();

        expect(infos).to.be.an("object").that.have.all.keys(
            "count",
            "maxItemsPerPage"
        );
        expect(infos.count).to.be.a("number").that.is.at.least(1);
    });

    it("should list existing permissions", async function () {
        const perms = await client.permissions.list();

        expect(perms).to.be.an("array").to.have.lengthOf.above(1);
        onePermission = perms[0];
        expect(onePermission).to.be.an("object").that.include.all.keys(
            "id",
            "name"
        );
    });

    it("should get infos about the fetched permission", async function () {
        const perm = await client.permissions.get(onePermission.id);

        expect(perm).to.be.an("object").that.include.all.keys(
            "id",
            "created_at",
            "updated_at"
        );
    });

    it("should check that a dummy permission doesn't exist", async function () {
        const doesExists = await client.permissions.exists("42");

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
