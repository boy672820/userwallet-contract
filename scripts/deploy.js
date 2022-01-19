async function main() {
  // We get the contract to deploy
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();

  // const UserWallet = await ethers.getContractFactory("UserWallet");
  // const userWallet = await UserWallet.deploy();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });