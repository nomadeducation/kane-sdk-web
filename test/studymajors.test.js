const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Study major", function () {
    const client = new Nomad();
    let newStudyMajor = {};
    const studyMajorName = `dummy study major ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new study major", async function () {
        const fakeStudyMajor = {
            name: studyMajorName
        };

        newStudyMajor = await client.studymajors.create(fakeStudyMajor);

        expect(newStudyMajor).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new study major", async function () {
        const doesExists = await client.studymajors.exists(newStudyMajor.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created study major", async function () {
        const fakeInfos = {
            name: `changed ${studyMajorName}`
        };

        const updated = await client.studymajors.update(newStudyMajor.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created study major", async function () {
        const removed = await client.studymajors.remove(newStudyMajor.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the study major doesn't exist", async function () {
        const doesExists = await client.studymajors.exists(newStudyMajor.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
