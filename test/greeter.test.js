const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Greeter', async function () {
  // users
  let owner, addr1;
  // contracts
  let greeter, myToken, greeterWallet;

  before(async function () {
    const [ownerSigner, addr1Signer] = await ethers.getSigners();

    owner = ownerSigner;
    addr1 = addr1Signer;

    // --------------------------------------------------------------------------

    const Greeter = await ethers.getContractFactory('Greeter');
    greeter = await Greeter.deploy();

    const MyToken = await ethers.getContractFactory('MyToken');
    myToken = await MyToken.deploy();

    // --------------------------------------------------------------------------

    console.log('Greeter Contract Address : ', greeter.address);
    console.log('MyToken Contract Address : ', myToken.address);
    console.log('Owner Address            : ', owner.address);
    console.log('Address1 Address         : ', addr1.address);
    console.log(
      '\n----------------------------- Good luck! -----------------------------\n'
    );
  });

  it('#1 Greeting test', async function () {
    const makeGreeter = async () => {
      await greeter.makeGreeter();
      const receiver = await new Promise((resolve, reject) => {
        greeter.on('LogNewWallet', (receiver) => {
          resolve(receiver);
        });
      });

      return receiver;
    };

    const wallet1 = await makeGreeter();
    const wallet2 = await makeGreeter();
    const wallet3 = await makeGreeter();
  });
});
