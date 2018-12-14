const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Role", function () {
    const client = new Nomad();
    let newRole = {};
    const roleName = `dummy role ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new role", async function () {
        const fakeRole = {
            name: roleName,
            description: faker.lorem.lines()
        };

        newRole = await client.role.create(fakeRole);

        expect(newRole).to.be.an("object").that.include.all.keys(
            "id",
            "created_at",
            "updated_at"
        );
    });

    it("should test the existence of the new role", async function () {
        const doesExists = await client.role.exists(newRole.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created role", async function () {
        const fakeInfos = {
            name: `changed ${roleName}`,
            description: faker.lorem.lines()
        };

        const updated = await client.role.update(newRole.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should list permissions of the created role", async function () {
        const perms = await client.role.listPermissions(newRole.id);

        expect(perms).to.be.an("array").that.is.empty;
    });

    it("should delete the created role", async function () {
        const removed = await client.role.remove(newRole.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the role doesn't exist", async function () {
        const doesExists = await client.role.exists(newRole.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
