const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Study minor", function () {
    const client = new Nomad();
    let newStudyMinor = {};
    const studyMinorName = `dummy study minor ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new study minor", async function () {
        const fakeStudyMinor = {
            name: studyMinorName
        };

        newStudyMinor = await client.studyminors.create(fakeStudyMinor);

        expect(newStudyMinor).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new study minor", async function () {
        const doesExists = await client.studyminors.exists(newStudyMinor.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created study minor", async function () {
        const fakeInfos = {
            name: `changed ${studyMinorName}`
        };

        const updated = await client.studyminors.update(newStudyMinor.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created study minor", async function () {
        const removed = await client.studyminors.remove(newStudyMinor.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the study minor doesn't exist", async function () {
        const doesExists = await client.studyminors.exists(newStudyMinor.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
