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
        this.getLinkToken = getLinkToken
        this.getVrfV1 = getVrfV1
        this.getCompoundV2 = getCompoundV2
        this.getCompoundTimelockV2 = getCompoundTimelockV2
    }
}

// Erc20

async function getERC20(name, symbol, decimals) {
    ethers = this.ethers;
    json = require('./.artifacts/ERC20Mock.json')
    const [owner] = await ethers.getSigners()
    ERC20 = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    erc20 = await ERC20.deploy(name, symbol, decimals)
    return erc20
}

// Uniswap v2

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
    pairAddress = await factory.getPair(token1, token2)
    if (pairAddress === "0x0000000000000000000000000000000000000000" ) {
        pairAddress = await factory.callStatic.createPair(token1, token2)
        await factory.createPair(token1, token2)
        pair = await ethers.getContractAt(json.abi, pairAddress, owner);
    } else {
        pair = await ethers.getContractAt(json.abi, pairAddress, owner);
    }
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

// Chainlink Pricefeed

async function getChainlinkPricefeed(decimals, description, version, price) {
    ethers = this.ethers;
    json = require('./.artifacts/ChainlinkPricefeedMock.json')
    const [owner] = await ethers.getSigners()
    Pricefeed = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    pricefeed = await Pricefeed.deploy(decimals, description, version, price)
    return pricefeed
}

// Chainlink Token

async function getLinkToken() {
    ethers = this.ethers;
    json = require('./.artifacts/LinkToken.json')
    const [owner] = await ethers.getSigners()
    LinkToken = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    linkToken = await LinkToken.deploy()
    return linkToken
}

// Chainlink VRF1

async function getVrfV1(link) {
    ethers = this.ethers;
    json = require('./.artifacts/VRFCoordinatorMock.json')
    const [owner] = await ethers.getSigners()
    Coordinator = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    coordinator = await Coordinator.deploy(link);
    return {
        address: coordinator.address,
        coordinator: coordinator,
        register: async function(hash, fee) {
            await this.coordinator.registerProvingKey(await ethers.utils.parseUnits(fee, 18), hash);
        },
        fulfill: async function() {
            number = Number(await this.coordinator.getStackLength());
            for (i = 0; i < number; i++) {
                const {randomUint256} = require('./random.js')
                await this.coordinator.fulfillRequest(randomUint256());
            }
        }
    }
}

// Compound V2

async function getCompoundTimelockV2(admin, delay) {
    ethers = this.ethers;
    json = require('./.artifacts/CompoundV2/Timelock.json')
    const [owner] = await ethers.getSigners()
    Timelock = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    timelock = await Timelock.deploy(admin, delay)
    return timelock;
}

async function getCompoundV2() {
    const [owner] = await ethers.getSigners()
    let timelock = await getCompoundTimelockV2(owner.address, 172800)
    return {
        timelock: timelock,
    }
}