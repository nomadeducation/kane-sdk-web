const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Form", function () {
    const client = new Nomad();
    let newForm = {};
    const formName = `dummy form ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new form", async function () {
        const fakeForm = {
            title: formName
        };

        newForm = await client.forms.create(fakeForm);

        expect(newForm).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new form", async function () {
        const doesExists = await client.forms.exists(newForm.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created form", async function () {
        const fakeInfos = {
            title: `changed ${formName}`
        };

        const updated = await client.forms.update(newForm.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created form", async function () {
        const removed = await client.forms.remove(newForm.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the form doesn't exist", async function () {
        const doesExists = await client.forms.exists(newForm.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
