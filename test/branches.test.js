const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Branch", function () {
    const client = new Nomad();
    let newBranch = {};
    const branchName = `dummy branch ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new branch", async function () {
        const fakeBranch = {
            name: branchName
        };

        newBranch = await client.branches.create(fakeBranch);

        expect(newBranch).to.be.an("object").that.include.all.keys(
            "id",
            "created_at",
            "updated_at"
        );
    });

    it("should test the existence of the new branch", async function () {
        const doesExists = await client.branches.exists(newBranch.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created branch", async function () {
        const fakeInfos = {
            name: `changed ${branchName}`
        };

        const updated = await client.branches.update(newBranch.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created branch", async function () {
        const removed = await client.branches.remove(newBranch.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the branch doesn't exist", async function () {
        const doesExists = await client.branches.exists(newBranch.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
