exports.Mock = class Mock {
    ethers

    constructor(ethers) {
        this.ethers = ethers
        this.getERC20 = getERC20
        this.getUniswapV2 = getUniswapV2
        this.getUniswapV2Pair = getUniswapV2Pair
    }
}

async function getERC20(name, symbol, decimals) {
    ethers = this.ethers;
    json = require('./.artifacts/ERC20Mock.json')
    const [owner] = await ethers.getSigners()
    ERC20 = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    erc20 = await ERC20.deploy(name, symbol, decimals)
    return erc20
}

async function getUniswapV2(beneficiary) {
    ethers = this.ethers;
    json = require('./.artifacts/UniswapV2Factory.json')
    const [owner] = await ethers.getSigners()
    Factory = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    factory = await Factory.deploy(beneficiary)
    return factory
}

async function getUniswapV2Pair(factory, token1, token2) {
    ethers = this.ethers;
    json = require('./.artifacts/UniswapV2Pair.json')
    const [owner] = await ethers.getSigners()
    pairAddress = await factory.callStatic.createPair(token1, token2)
    await factory.createPair(token1, token2)
    pair = await ethers.getContractAt(json.abi, pairAddress, owner);
    return pair
}