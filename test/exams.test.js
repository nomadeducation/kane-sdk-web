const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Exam", function () {
    const client = new Nomad();
    let newExam = {};
    const examName = `dummy exam ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new exam", async function () {
        const fakeExam = {
            name: examName
        };

        newExam = await client.exams.create(fakeExam);

        expect(newExam).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new exam", async function () {
        const doesExists = await client.exams.exists(newExam.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created exam", async function () {
        const fakeInfos = {
            name: `changed ${examName}`
        };

        const updated = await client.exams.update(newExam.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created exam", async function () {
        const removed = await client.exams.remove(newExam.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the exam doesn't exist", async function () {
        const doesExists = await client.exams.exists(newExam.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
