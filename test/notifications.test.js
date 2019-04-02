const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Notification", function () {
    const client = new Nomad();
    let newNotification = {};
    const notificationName = `dummy notification ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new notification", async function () {
        const fakeNotification = {
            name: notificationName,
            title: notificationName,
            content: faker.lorem.lines(),
            send_date: faker.date.future()
        };

        newNotification = await client.notifications.create(fakeNotification);

        expect(newNotification).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new notification", async function () {
        const doesExists = await client.notifications.exists(newNotification.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created notification", async function () {
        const fakeInfos = {
            name: `changed ${notificationName}`
        };

        const updated = await client.notifications.update(newNotification.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created notification", async function () {
        const removed = await client.notifications.remove(newNotification.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the notification doesn't exist", async function () {
        const doesExists = await client.notifications.exists(newNotification.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
