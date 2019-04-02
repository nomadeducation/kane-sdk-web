const Nomad = require("dist/node");
const account = require("./account");
const faker = require("faker/locale/fr");
const chai = require("chai");
const expect = chai.expect;

describe("Job", function () {
    const client = new Nomad();
    let newJob = {};
    const jobName = `dummy job ${faker.random.uuid()}`;

    before(async () => {
        const isConnected = await client.login(account.username, account.password);
        expect(isConnected).to.be.true;
    });

    after(async () => {
        const loggedOut = await client.logout();
        expect(loggedOut).to.be.true;
    });

    it("should create a new job", async function () {
        const fakeJob = {
            title: jobName
        };

        newJob = await client.jobs.create(fakeJob);

        expect(newJob).to.be.an("object").that.include.all.keys(
            "id",
            "created_at"
        );
    });

    it("should test the existence of the new job", async function () {
        const doesExists = await client.jobs.exists(newJob.id);

        expect(doesExists).to.be.a("boolean").that.is.true;
    });

    it("should update the created job", async function () {
        const fakeInfos = {
            title: `changed ${jobName}`
        };

        const updated = await client.jobs.update(newJob.id, fakeInfos);

        expect(updated).to.be.a("boolean").that.is.true;
    });

    it("should delete the created job", async function () {
        const removed = await client.jobs.remove(newJob.id);

        expect(removed).to.be.a("boolean").that.is.true;
    });

    it("should check that the job doesn't exist", async function () {
        const doesExists = await client.jobs.exists(newJob.id);

        expect(doesExists).to.be.a("boolean").that.is.false;
    });
});
