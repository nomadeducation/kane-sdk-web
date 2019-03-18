const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Quizzes", function () {
    const client = new Nomad();
    let newQuiz = {};
    const quizName = `dummy quiz ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new quiz", async function () {
        const fakePost = {
            title: quizName,
            content_type: "exercise"
        };

        newQuiz = await client.quizzes.create(fakePost);

        expect(newQuiz).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new quiz", async function () {
        const doesExists = await client.quizzes.exists(newQuiz.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created quiz", async function () {
        const fakeInfos = {
            title: `changed ${quizName}`
        };

        const updated = await client.quizzes.update(newQuiz.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created quiz", async function () {
        const removed = await client.quizzes.remove(newQuiz.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the quiz doesn't exist", async function () {
        const doesExists = await client.quizzes.exists(newQuiz.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
