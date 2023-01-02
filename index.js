exports.Mock = class Mock {
    ethers

    constructor(ethers) {
        this.ethers = ethers

        this.getERC20 = getERC20
        this.getWeth9 = getWeth9
        this.getChainlinkPricefeed = getChainlinkPricefeed
        this.getLinkToken = getLinkToken
        this.getVrfV1 = getVrfV1
        this.createCompoundV2 = createCompoundV2
        this.createUniswapV2 = createUniswapV2
        this.createUniswapV3 = createUniswapV3

        // Deprecated, deleted after 3.0
        this.getUniswapV2 = getUniswapV2
        this.getUniswapV2Factory = getUniswapV2Factory
        this.getUniswapV2Pair = getUniswapV2Pair
        this.getUniswapV2Router = getUniswapV2Router
    }
}

// Erc20

async function getERC20(name, symbol, decimals) {
    ethers = this.ethers;
    let json = require('./.artifacts/ERC20Mock.json')
    const [owner] = await ethers.getSigners()
    ERC20 = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    erc20 = await ERC20.deploy(name, symbol, decimals)
    return erc20
}

// Uniswap v2

async function getWeth9() {
    ethers = this.ethers;
    let json = require('./.artifacts/WETH9.json')
    const [owner] = await ethers.getSigners()
    Weth9 = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    weth = await Weth9.deploy();
    return weth
}

/**
 * @deprecated Since version 1.3.14. Will be deleted in 3.0.0.
 */

async function getUniswapV2Factory(beneficiary) {
    ethers = this.ethers;
    let json = require('./.artifacts/UniswapV2Factory.json')
    const [owner] = await ethers.getSigners()
    Factory = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    factory = await Factory.deploy(beneficiary)
    return factory
}

/**
 * @deprecated Since version 1.3.14. Will be deleted in 3.0.0.
 */


async function getUniswapV2Pair(factory, token1, token2) {
    ethers = this.ethers;
    let json = require('./.artifacts/UniswapV2Pair.json')
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

/**
 * @deprecated Since version 1.3.14. Will be deleted in 3.0.0.
 */

async function getUniswapV2Router(factory, WETH) {
    ethers = this.ethers;
    let json = require('./.artifacts/UniswapV2Router02.json')
    const [owner] = await ethers.getSigners()
    Router = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    router = await Router.deploy(factory, WETH);
    return router
}

/**
 * @deprecated Since version 1.3.14. Will be deleted in 3.0.0.
 */

async function getUniswapV2(beneficiary) {
    weth = await this.getWeth9()
    factory = await this.getUniswapV2Factory(beneficiary)
    router = await this.getUniswapV2Router(factory.address, weth.address)
    return [router, factory, weth]
}

// Chainlink Pricefeed

async function getChainlinkPricefeed(decimals, description, version, price) {
    ethers = this.ethers;
    let json = require('./.artifacts/ChainlinkPricefeedMock.json')
    const [owner] = await ethers.getSigners()
    Pricefeed = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    pricefeed = await Pricefeed.deploy(decimals, description, version, price)
    return pricefeed
}

// Chainlink Token

async function getLinkToken() {
    ethers = this.ethers;
    let json = require('./.artifacts/LinkToken.json')
    const [owner] = await ethers.getSigners()
    LinkToken = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    linkToken = await LinkToken.deploy()
    return linkToken
}

// Chainlink VRF1

async function getVrfV1(link) {
    ethers = this.ethers;
    let json = require('./.artifacts/VRFCoordinatorMock.json')
    const [owner] = await ethers.getSigners()
    Coordinator = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    coordinator = await Coordinator.deploy(link);
    return {
        address: coordinator.address,
        coordinator: coordinator,
        register: async function(network) {
            switch (network) {
                case "mainnet":
                    await this.customRegister("0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445", "2.0")
                    break;
                case "polygon":
                    await this.customRegister("0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da", "0.0001");
                    break;
                case "mumbai":
                    await this.customRegister("0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4", "0.0001");
                    break;
                case "bnb":
                    await this.customRegister("0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c", "0.2");
                    break;
                case "bnb testnet":
                    await this.customRegister("0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186", "0.1");
                    break;
                case "goerli":
                    await this.customRegister("0x0476f9a745b61ea5c0ab224d3a6e4c99f0b02fce4da01143a4f70aa80ae76e8a", "0.1");
                    break;
                default:
                    throw new Error("VRF V1: Chain unsupported")
            }
        },
        customRegister: async function(hash, fee) {
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

async function createCompoundV2() {
    const {createNewCompoundV2} = require('./compoundv2.js');
    return createNewCompoundV2(ethers);
}

async function createUniswapV2(weth9Address, feeToAddress) {
    const {createNewUniswapV2} = require('./uniswapv2.js');
    return createNewUniswapV2(ethers, weth9Address, feeToAddress);
}

async function createUniswapV3() {
    const {createNewUniswapV2} = require('./uniswapv3.js');
    return createNewUniswapV3(ethers);
}