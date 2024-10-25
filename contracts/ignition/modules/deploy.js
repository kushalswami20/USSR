
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AddUser", (m) => {
    
    const user = m.contract("AddUser", []);
  
    return { user };
  });