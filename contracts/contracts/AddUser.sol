// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract AddUser {
    uint256 public id;
    struct User{
        uint256 id;
        address useraddress;
        uint256 timestamp;
        string name;
        string datahash;
    }

    event userRecord(
        uint256 id,
        address indexed useraddress,
        uint256 timestamp,
        string name,
        string datahash
    );

    mapping(uint256 => User) public users;
    mapping(address => User) public userByAddress;
    address[] private userAddress;

    function addUser(
        address useraddress,
        string memory name,
        string memory datahash
    ) public {
        require(bytes(name).length > 0, "Name cannot be empty");

        id++;

        User memory newUser= User(
            id,
            useraddress,
            block.timestamp,
            name,
            datahash
        );

        users[id]=newUser;
        userByAddress[useraddress] = newUser;

        userAddress.push(useraddress);

        emit userRecord(
            id,
            useraddress,
            block.timestamp,
            name,
            datahash
        );


    }

    function getUserData(uint256 id) public view returns (
        uint256 ,
        address ,
        uint256 ,
        string memory,
        string memory
    ){
        User storage userData = users[id];

        return(
            userData.id,
            userData.useraddress,
            userData.timestamp,
            userData.name,
            userData.datahash
        );
    }

    function getid() public view returns (uint) {
        return id;
    }
    function getname() public view returns (string memory) {
        return users[id].name;
    }
    function getTimeStamp() public view returns (uint) {
        return users[id].timestamp;
    }
}
