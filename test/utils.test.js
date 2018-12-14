const utils = require("../src/utils");
const chai = require("chai");
const expect = chai.expect;

describe("Utils", function () {
    it("should extract the token infos", function () {
        const token = "4fb11e3214d6e15c27a1a2ea1b7c23820c8bada4";
        const infos = utils.extractTokenInfos(token);

        expect(infos).to.be.an("object").that.have.all.keys(
            "createdAt",
            "randomData"
        );

        expect(infos.createdAt.getTime()).to.be.equal(1337007666000);
        expect(infos.randomData).to.be.equal("14d6e15c27a1a2ea1b7c23820c8bada4");
    });

    it("should return 'null' when the token is malformed", function () {
        const token = "b4dc0ffee";
        const infos = utils.extractTokenInfos(token);
        expect(infos).to.be.null;
    });

    it("should extract the 'count' info from the 'content-range' header", function () {
        const contentRange = "items */666";
        const count = utils.extractCount(contentRange);
        expect(count).to.be.a("number").that.equal(666);
    });
});
