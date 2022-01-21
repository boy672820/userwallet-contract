const { expect } = require('chai');
const { ethers } = require('hardhat');
const UserWalletArtifact = require('../artifacts/contracts/v4/UserWallet.sol/UserWallet.json');

describe('MyToken', async function () {
  // users
  let owner, addr1;
  // contracts
  let myToken, myToken2, controller;
  // functions
  let getBalance, tkn2getBalance;
  // wallet address
  let walletAddress;

  before(async function () {
    const [ownerSigner, addr1Signer] = await ethers.getSigners();

    owner = ownerSigner;
    addr1 = addr1Signer;

    // --------------------------------------------------------------------------

    const MyToken = await ethers.getContractFactory('MyToken', { from: addr1.address });
    myToken = await MyToken.deploy();

    const MyToken2 = await ethers.getContractFactory('MyToken2', { from: addr1.address });
    myToken2 = await MyToken2.deploy();

    const Controller = await ethers.getContractFactory('Controller');
    controller = await Controller.deploy();

    // --------------------------------------------------------------------------

    getBalance = async (address) => {
      return (await myToken.balanceOf(address)).toString();
    };

    tkn2getBalance = async (address) => {
      return (await myToken2.balanceOf(address)).toString();
    };

    // --------------------------------------------------------------------------

    console.log('  Controller Contract Address : ', controller.address);
    console.log('  MyToken Contract Address    : ', myToken.address);
    console.log('  Owner Address               : ', owner.address);
    console.log('  Address1 Address            : ', addr1.address);
    console.log(
      '\n  ------------------------------- Good luck! -------------------------------\n'
    );
  });

  it('#1 Create user wallet', async function () {
    const makeWallet = async () => {
      await controller.makeWallet();
      const receiver = await new Promise((resolve, reject) => {
        controller.on('LogNewWallet', (receiver) => {
          resolve(receiver);
        });
      });

      return receiver;
    };

    walletAddress = await makeWallet();

    console.log('Create wallet address: ', walletAddress);

    expect(walletAddress).but.not.an('null');
  });

  it('#2 Transfer token to new wallet', async function () {
    const amount = 1000;

    await myToken.transfer(walletAddress, amount);
    await myToken2.transfer(walletAddress, amount);

    const tknBalance = await getBalance(walletAddress);
    const tkn2Balance = await tkn2getBalance(walletAddress);

    console.log(`TKN Balance of ${walletAddress}: `, tknBalance);
    console.log(`TKN2 Balance of ${walletAddress}: `, tkn2Balance);
  });

  it('#3 Sweep token', async function () {
    const wallet = new ethers.Contract(
      walletAddress,
      UserWalletArtifact.abi,
      owner
    );

    await wallet.sweep(myToken.address, 1000);
    await wallet.sweep(myToken2.address, 1000);

    const balance = await getBalance(walletAddress);
    const balance2 = await tkn2getBalance(walletAddress);

    expect(balance).to.equal('0');
    expect(balance2).to.equal('0');
  });
});
