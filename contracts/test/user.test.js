const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AddUser Contract", function () {
  let AddUser;
  let addUser;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    AddUser = await ethers.getContractFactory("AddUser");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new AddUser contract before each test
    addUser = await AddUser.deploy();
    await addUser.waitForDeployment();
  });

  describe("User Management", function () {
    it("Should add a new user correctly", async function () {
      const userAddress = addr1.address;
      const userName = "John Doe";
      const dataHash = "QmXz5YwfNVpx..."; // Example IPFS hash

      // Add a new user
      await addUser.addUser(userAddress, userName, dataHash);

      // Get the user data
      const userData = await addUser.getUserData(1);

      // Verify user data
      expect(userData[0]).to.equal(1); // id
      expect(userData[1]).to.equal(userAddress); // useraddress
      expect(userData[3]).to.equal(userName); // name
      expect(userData[4]).to.equal(dataHash); // datahash
    });

    it("Should increment ID correctly for multiple users", async function () {
      // Add first user
      await addUser.addUser(addr1.address, "User 1", "Hash1");
      expect(await addUser.getid()).to.equal(1);

      // Add second user
      await addUser.addUser(addr2.address, "User 2", "Hash2");
      expect(await addUser.getid()).to.equal(2);
    });

    // it("Should emit userRecord event when adding user", async function () {
    //   const userAddress = addr1.address;
    //   const userName = "Jane Doe";
    //   const dataHash = "QmXz5YwfNVpx...";

    //   // Test event emission
    //   const tx = await addUser.addUser(userAddress, userName, dataHash);
    //   const receipt = await tx.wait();

    //   // Get the event from the receipt
    //   const event = receipt.events?.find(e => e.event === 'userRecord');
    //   expect(event).to.not.be.undefined;
    //   expect(event.args[0]).to.equal(1); // id
    //   expect(event.args[1]).to.equal(userAddress); // useraddress
    //   expect(event.args[3]).to.equal(userName); // name
    //   expect(event.args[4]).to.equal(dataHash); // datahash
      
    //   // Verify timestamp is recent (within last minute)
    //   const timestamp = event.args[2];
    //   const now = Math.floor(Date.now() / 1000);
    //   expect(timestamp).to.be.closeTo(now, 60);
    // });

    it("Should revert when adding user with empty name", async function () {
      await expect(
        addUser.addUser(addr1.address, "", "Hash1")
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("Should return correct name and timestamp", async function () {
      const userName = "Test User";
      await addUser.addUser(addr1.address, userName, "Hash1");

      expect(await addUser.getname()).to.equal(userName);
      expect(await addUser.getTimeStamp()).to.be.gt(0);
    });

    it("Should store user data in mappings correctly", async function () {
      const userAddress = addr1.address;
      const userName = "Test User";
      const dataHash = "Hash1";

      await addUser.addUser(userAddress, userName, dataHash);
      
      // Check user by ID
      const userById = await addUser.users(1);
      expect(userById.name).to.equal(userName);
      expect(userById.useraddress).to.equal(userAddress);
      expect(userById.datahash).to.equal(dataHash);

      // Check user by address
      const userByAddr = await addUser.userByAddress(userAddress);
      expect(userByAddr.name).to.equal(userName);
      expect(userByAddr.id).to.equal(1);
      expect(userByAddr.datahash).to.equal(dataHash);
    });
  });
});