exports.Mock = class Mock {
    ethers

    constructor(ethers) {
        this.ethers = ethers
        this.getERC20 = getERC20
    }
}

async function getERC20(name, symbol, decimals) {
    ethers = this.ethers;
    json = require('./.artifacts/ERC20Mock.json')
    owner = await ethers.getSigners()
    ERC20 = await ethers.ContractFactory(json.abi, json.bytecode, owner);
    erc20 = await ERC20.deploy(name, symbol, decimals)
    return erc20
}