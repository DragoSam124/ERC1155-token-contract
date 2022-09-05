const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const {BigNumber} = require('ethers')

describe("ERC1155", function () {
  async function deploy() {

    const [owner, addr1, addr2] = await ethers.getSigners();

    const ERC1155 = await ethers.getContractFactory("ERC1155");
    const erc1155 = await ERC1155.deploy("HTTPESL//myURI/");
    await erc1155.deployed();

    return { erc1155, owner, addr1, addr2 };
  }

  describe("Deployment", async function () {
    it("Should be set uri", async function () {
      const {erc1155, owner, addr1, addr2} = await deploy();
      expect(await erc1155.uri(0)).to.equal("HTTPESL//myURI/");
    });

    it("Should check mint & transfer", async function () {
      const {erc1155, owner, addr1, addr2} = await deploy();
      await erc1155.mint(owner.address, BigNumber.from("0"), BigNumber.from("10000"), []);
      console.log("After mint to owner -> owner amount: ", await erc1155.balanceOf(owner.address, BigNumber.from("0")));

      await erc1155.safeTransferFrom(owner.address, addr1.address, BigNumber.from("0"), BigNumber.from("8000"), []);
      console.log("After transfer owner to addr1(8000) -> owner result: ", await erc1155.balanceOf(owner.address, BigNumber.from("0")));
      console.log("After transfer owner to addr1(8000) -> addr1 result: ", await erc1155.balanceOf(addr1.address, BigNumber.from("0")));
    });
    it("Should check balanceofBatch in addr2", async function () {
      const {erc1155, owner, addr1, addr2} = await deploy();
      await erc1155.mint(addr2.address, BigNumber.from("0"), BigNumber.from("10000"), []);
      await erc1155.mint(addr2.address, BigNumber.from("1"), BigNumber.from("10000"), []);
      await erc1155.mint(addr2.address, BigNumber.from("2"), BigNumber.from("10000"), []);
      console.log("After mint to addr2-0, 1, 2 -> result of them: ", await erc1155.balanceOfBatch([addr2.address, addr2.address, addr2.address], [0, 1, 2]));
    });
    it("Should check approve address", async function () {
      const {erc1155, owner, addr1, addr2} = await  deploy();
      console.log("before set approve owner to addr2 -> result: ", await erc1155.isApprovedForAll(owner.address, addr1.address));
      await erc1155.setApprovalForAll(addr1.address, true);
      console.log("after set approve owner to addr2 -> result: ", await erc1155.isApprovedForAll(owner.address, addr1.address));
    });
  });
});
