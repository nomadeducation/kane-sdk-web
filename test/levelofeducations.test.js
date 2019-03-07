const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Level of education", function () {
    const client = new Nomad();
    let newLevelOfEducation = {};
    const levelOfEducationName = `dummy level of education ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new level of education", async function () {
        const fakeLevelOfEducation = {
            name: levelOfEducationName,
            value: 666
        };

        newLevelOfEducation = await client.levelofeducations.create(fakeLevelOfEducation);

        expect(newLevelOfEducation).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new level of education", async function () {
        const doesExists = await client.levelofeducations.exists(newLevelOfEducation.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created level of education", async function () {
        const fakeInfos = {
            name: `changed ${levelOfEducationName}`,
            value: 42
        };

        const updated = await client.levelofeducations.update(newLevelOfEducation.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created level of education", async function () {
        const removed = await client.levelofeducations.remove(newLevelOfEducation.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the level of education doesn't exist", async function () {
        const doesExists = await client.levelofeducations.exists(newLevelOfEducation.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
