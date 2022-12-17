exports.Mock = class Mock {
    ethers

    constructor(ethers) {
        this.ethers = ethers
        this.getERC20 = getERC20
        this.getUniswapV2 = getUniswapV2
        this.getUniswapV2Factory = getUniswapV2Factory
        this.getUniswapV2Pair = getUniswapV2Pair
        this.getUniswapV2Router = getUniswapV2Router
        this.getWeth9 = getWeth9
        this.getChainlinkPricefeed = getChainlinkPricefeed
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

async function getUniswapV2Factory(beneficiary) {
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
    pairAddress = await factory.getPair(token1.address, token2.address);
    if (pairAddress === ethers.constants.AddressZero) {
        pairAddress = await factory.callStatic.createPair(token1, token2)
        await factory.createPair(token1, token2)
        pair = await ethers.getContractAt(json.abi, pairAddress, owner);
        return pair    
    }
    pair = await ethers.getContractAt(json.abi, pairAddress, owner);
    return pair
}

async function getWeth9() {
    ethers = this.ethers;
    json = require('./.artifacts/WETH9.json')
    const [owner] = await ethers.getSigners()
    Weth9 = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    weth = await Weth9.deploy();
    return weth
}

async function getUniswapV2Router(factory, WETH) {
    ethers = this.ethers;
    json = require('./.artifacts/UniswapV2Router02.json')
    const [owner] = await ethers.getSigners()
    Router = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    router = await Router.deploy(factory, WETH);
    return router
}

async function getUniswapV2(beneficiary) {
    weth = await this.getWeth9()
    factory = await this.getUniswapV2Factory(beneficiary)
    router = await this.getUniswapV2Router(factory.address, weth.address)
    return [router, factory, weth]
}

async function getChainlinkPricefeed(decimals, description, version, price) {
    ethers = this.ethers;
    json = require('./.artifacts/ChainlinkPricefeedMock.json')
    const [owner] = await ethers.getSigners()
    Pricefeed = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    pricefeed = await Pricefeed.deploy(decimals, description, version, price)
    return pricefeed
}