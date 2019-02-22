const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Study domain", function () {
    const client = new Nomad();
    let newStudyDomain = {};
    const fakeName = `dummy study domain ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new study domain", async function () {
        const fakeStudyDomain = {
            name: fakeName
        };

        newStudyDomain = await client.studydomains.create(fakeStudyDomain);

        expect(newStudyDomain).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new study domain", async function () {
        const doesExists = await client.studydomains.exists(newStudyDomain.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created study domain", async function () {
        const fakeInfos = {
            name: `changed ${fakeName}`
        };

        const updated = await client.studydomains.update(newStudyDomain.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should list options of the created study domain", async function () {
        const options = await client.studydomains.listOptions(newStudyDomain.id);

        expect(options).to.be.an("array").that.is.empty;
    });

    it("should delete the created study domain", async function () {
        const removed = await client.studydomains.remove(newStudyDomain.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the study domain doesn't exist", async function () {
        const doesExists = await client.studydomains.exists(newStudyDomain.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
