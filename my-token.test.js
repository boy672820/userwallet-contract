const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyToken', async function () {
  // users
  let owner, addr1;
  // contracts
  let myToken, userWallet, controller;
  // functions
  let getBalance;

  before(async function () {
    const [ownerSigner, addr1Signer] = await ethers.getSigners();

    owner = ownerSigner;
    addr1 = addr1Signer;

    // --------------------------------------------------------------------------

    const MyToken = await ethers.getContractFactory('MyToken');
    myToken = await MyToken.deploy();

    const Controller = await ethers.getContractFactory('Controller');
    controller = await Controller.deploy();

    const UserWallet = await ethers.getContractFactory('UserWallet', {
      signer: addr1,
    });
    userWallet = await UserWallet.deploy(myToken.address);

    // --------------------------------------------------------------------------

    getBalance = async (address) => {
      return (await myToken.balanceOf(address)).toString();
    };

    // --------------------------------------------------------------------------

    console.log('MyToken Contract Address: ', myToken.address);
    console.log('Controller Contract Address: ', controller.address);
    console.log('Owner Address: ', owner.address);
    console.log('Address1 Address: ', addr1.address);
  });

  it('#1 MyToken: Transfer', async function () {
    await myToken.transfer(addr1.address, 1000);

    const balanceOfAddr1 = await getBalance(addr1.address);
    const balanceOfOwner = await getBalance(owner.address);

    expect(balanceOfAddr1).to.equal('1000');
    expect(balanceOfOwner).to.equal('9999999999999999999000');
  });

  it('#2 Controller: Make user wallet', async function () {
    const newWallet = await controller.makeWallet();

    
  });
});
