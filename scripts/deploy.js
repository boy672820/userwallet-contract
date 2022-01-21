async function main() {
  // We get the contract to deploy
  const Token = await ethers.getContractFactory('MyToken');
  const token = await Token.deploy();

  console.log('Token deployed to: ', token.address);

  const Controller = await ethers.getContractFactory('Controller');
  const controller = await Controller.deploy();

  console.log('Sweeper deployed to: ', controller.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
