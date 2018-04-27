const nomad = require("dist/test/sdk.node");
const mockServer = require("mockttp").getLocal();
const chai = require("chai");
const expect = chai.expect;

describe("Dummy test", function () {
    // use the same port as defined in webpack.test.js
    beforeEach(() => mockServer.start(3333));
    afterEach(() => mockServer.stop());

    it("should return true", async function () {
        await mockServer.get("/v2/users").thenReply(200, JSON.stringify([
            {
                id: "676a14fc-5b67-4462-a1e5-dd4e3208b593",
                first_name: "mr",
                last_name: "robot",
                email: "elliot@e-corp-usa.com",
                created_at: "2018-03-09T18:25:47.369Z",
                updated_at: "2018-03-09T19:11:28.798Z"
            },
            {
                id: "edb324b9-2fea-4765-83d1-d6ed6f2d3af5",
                email: "johnj@example.com",
                created_at: "2018-03-09T18:25:47.369Z",
                updated_at: "2018-03-09T19:11:28.798Z"
            }
        ]));

        const res = await nomad.users();
        const users = res.data;
        expect(users).to.be.an("array").that.has.lengthOf(2);

        for (const user of users) {
            expect(user).to.include.all.keys(
                "id",
                "email",
                "created_at",
                "updated_at"
            );
        }
    });
});
