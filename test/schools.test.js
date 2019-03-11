const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("School", function () {
    const client = new Nomad();
    let newSchool = {};
    const schoolName = `dummy school ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new school", async function () {
        const fakeSchool = {
            name: schoolName
        };

        newSchool = await client.schools.create(fakeSchool);

        expect(newSchool).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new school", async function () {
        const doesExists = await client.schools.exists(newSchool.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created school", async function () {
        const fakeInfos = {
            name: `changed ${schoolName}`
        };

        const updated = await client.schools.update(newSchool.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created school", async function () {
        const removed = await client.schools.remove(newSchool.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the school doesn't exist", async function () {
        const doesExists = await client.schools.exists(newSchool.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
