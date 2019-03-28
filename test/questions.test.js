const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Questions", function () {
    const client = new Nomad();
    let newQuestion = {};
    const questionName = `dummy question ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new question", async function () {
        const fakeQuestion = {
            title: questionName,
            content_type: "question"
        };

        newQuestion = await client.questions.create(fakeQuestion);

        expect(newQuestion).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new question", async function () {
        const doesExists = await client.questions.exists(newQuestion.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created question", async function () {
        const fakeInfos = {
            title: `changed ${questionName}`
        };

        const updated = await client.questions.update(newQuestion.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created question", async function () {
        const removed = await client.questions.remove(newQuestion.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the question doesn't exist", async function () {
        const doesExists = await client.questions.exists(newQuestion.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
