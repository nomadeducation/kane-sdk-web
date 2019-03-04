const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Study choice", function () {
    const client = new Nomad();
    let newStudyChoice = {};
    const fakeName = `dummy study choice ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new study choice", async function () {
        const fakeStudyChoice = {
            name: fakeName
        };

        newStudyChoice = await client.studychoices.create(fakeStudyChoice);

        expect(newStudyChoice).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new study choice", async function () {
        const doesExists = await client.studychoices.exists(newStudyChoice.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created study choice", async function () {
        const fakeInfos = {
            name: `changed ${fakeName}`
        };

        const updated = await client.studychoices.update(newStudyChoice.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should list options of the created study choice", async function () {
        const options = await client.studychoices.listOptions(newStudyChoice.id);

        expect(options).to.be.an("array").that.is.empty;
    });

    it("should delete the created study choice", async function () {
        const removed = await client.studychoices.remove(newStudyChoice.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the study choice doesn't exist", async function () {
        const doesExists = await client.studychoices.exists(newStudyChoice.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
