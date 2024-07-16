import { expect } from "chai";
import { ethers } from "hardhat";

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("RedCandleToken");
    const hardhatToken = await Token.deploy();
    return { hardhatToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // initial balance of owner
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      const transferAmount = BigInt(50);
      await hardhatToken.transfer(addr1.address, transferAmount);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      let ownerBalance = await hardhatToken.balanceOf(owner.address);

      expect(addr1Balance).to.equal(transferAmount);
      expect(ownerBalance).to.equal(initialOwnerBalance - transferAmount);

      // Transfer 50 tokens from addr1 to addr2
      await hardhatToken.connect(addr1).transfer(addr2.address, transferAmount);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    // emit Transfer(msg.sender, to, amount);
    it("Should emit a Transfer event", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      const transferAmount = BigInt(50);
      expect(await hardhatToken.transfer(addr1.address, transferAmount))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );

      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Transfer 50 tokens from owner to addr1
      const transferAmount = BigInt(100);
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, transferAmount)
      ).to.be.reverted;

      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialOwnerBalance);

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(BigInt(0));
    });
  });
});
