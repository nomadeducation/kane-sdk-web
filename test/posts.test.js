const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Post", function () {
    const client = new Nomad();
    let newPost = {};
    const postName = `dummy post ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new post", async function () {
        const fakePost = {
            title: postName,
            content_type: "course",
            content: faker.lorem.paragraphs()
        };

        newPost = await client.posts.create(fakePost);

        expect(newPost).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new post", async function () {
        const doesExists = await client.posts.exists(newPost.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created post", async function () {
        const fakeInfos = {
            title: `changed ${postName}`
        };

        const updated = await client.posts.update(newPost.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created post", async function () {
        const removed = await client.posts.remove(newPost.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the post doesn't exist", async function () {
        const doesExists = await client.posts.exists(newPost.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
