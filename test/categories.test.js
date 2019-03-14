const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Category", function () {
    const client = new Nomad();
    let newCategory = {};
    const categoryName = `dummy category ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new category", async function () {
        const fakePost = {
            title: categoryName,
            content_type: "chapter"
        };

        newCategory = await client.categories.create(fakePost);

        expect(newCategory).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new category", async function () {
        const doesExists = await client.categories.exists(newCategory.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created category", async function () {
        const fakeInfos = {
            title: `changed ${categoryName}`
        };

        const updated = await client.categories.update(newCategory.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created category", async function () {
        const removed = await client.categories.remove(newCategory.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the category doesn't exist", async function () {
        const doesExists = await client.categories.exists(newCategory.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
