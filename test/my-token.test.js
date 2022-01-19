const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyToken', async function () {
  // users
  let owner, addr1;
  // contracts
  let myToken, userWallet, userWalletTest;
  // functions
  let getBalance;

  before(async function () {
    const [ownerSigner, addr1Signer] = await ethers.getSigners();

    owner = ownerSigner;
    addr1 = addr1Signer;

    // --------------------------------------------------------------------------

    const MyToken = await ethers.getContractFactory('MyToken');
    myToken = await MyToken.deploy();

    const UserWallet = await ethers.getContractFactory('UserWallet', {
      signer: addr1,
    });
    userWallet = await UserWallet.deploy(myToken.address);

    const UserWalletTest = await ethers.getContractFactory('UserWalletTest', {
      signer: addr1,
    });
    userWalletTest = UserWalletTest.deploy(myToken.address);

    // --------------------------------------------------------------------------

    getBalance = async (address) => {
      return (await myToken.balanceOf(address)).toString();
    };

    // --------------------------------------------------------------------------

    console.log('MyToken Contract Address: ', myToken.address);
    console.log('UserWallet Contract Address: ', userWallet.address);
  });

  it('#1 MyToken transfer', async function () {
    await myToken.deployed();

    await myToken.transfer(addr1.address, 1000);

    const balanceOfAddr1 = await getBalance(addr1.address);
    const balanceOfOwner = await getBalance(owner.address);

    expect(balanceOfAddr1).to.equal('1000');
    expect(balanceOfOwner).to.equal('9999999999999999999000');
  });

  it('#2 UserWallet', async function () {
    const balanceOfAddr1 = await getBalance(addr1.address);

    expect(balanceOfAddr1).to.equal('1000');

    await userWallet.sweep(myToken.address, 1000);

    // expect(balanceOfAddr1).to.equal('0');
  });
});
