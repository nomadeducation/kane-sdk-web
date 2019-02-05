const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Media", function () {
    const client = new Nomad();
    let newMedia = {};
    const mediaName = `dummy media ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new media", async function () {
        const fakeMedia = {
            name: mediaName,
            description: faker.lorem.lines(),
            url: "https://res.cloudinary.com/nomadeducation/image/upload/v1494581566/Logos/logo_nomad_detoure.png",
            type: "image",
            mime: faker.system.mimeType(),
            width: faker.random.number(),
            height: faker.random.number(),
            syncForced: faker.random.boolean()
        };

        newMedia = await client.media.create(fakeMedia);

        expect(newMedia).to.be.an("object").that.include.all.keys(
            "id",
            "created_at",
            "updated_at"
        );
    });

    it("should test the existence of the new media", async function () {
        const doesExists = await client.media.exists(newMedia.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created media", async function () {
        const fakeInfos = {
            name: `changed ${mediaName}`,
            description: faker.lorem.lines()
        };

        const updated = await client.media.update(newMedia.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created media", async function () {
        const removed = await client.media.remove(newMedia.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the media doesn't exist", async function () {
        const doesExists = await client.media.exists(newMedia.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
