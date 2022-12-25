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
        this.getCompoundUnitrollerV2 = getCompoundUnitrollerV2
        this.createCompoundV2 = createCompoundV2
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

async function getUniswapV2Factory(beneficiary) {
    ethers = this.ethers;
    let json = require('./.artifacts/UniswapV2Factory.json')
    const [owner] = await ethers.getSigners()
    Factory = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    factory = await Factory.deploy(beneficiary)
    return factory
}

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

async function getWeth9() {
    ethers = this.ethers;
    let json = require('./.artifacts/WETH9.json')
    const [owner] = await ethers.getSigners()
    Weth9 = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    weth = await Weth9.deploy();
    return weth
}

async function getUniswapV2Router(factory, WETH) {
    ethers = this.ethers;
    let json = require('./.artifacts/UniswapV2Router02.json')
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

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */
async function getCompoundTimelockV2(admin, delay) {
    ethers = this.ethers;
    let json = require('./.artifacts/CompoundV2/Timelock.json')
    const [owner] = await ethers.getSigners()
    Timelock = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    timelock = await Timelock.deploy(admin, delay)
    return timelock;
}

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */
async function getCompoundUnitrollerV2() {
    ethers = this.ethers;
    let json = require('./.artifacts/CompoundV2/Unitroller.json')
    const [owner] = await ethers.getSigners()
    Unitroller = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    unitroller = await Unitroller.deploy()
    return unitroller;
}

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */
async function getCompoundComptrollerV2() {
    ethers = this.ethers;
    let json = require('./.artifacts/CompoundV2/Comptroller.json')
    const [owner] = await ethers.getSigners()
    Comptroller = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    comptroller = await Comptroller.deploy()
    return comptroller;
}

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */
async function getCompoundOracleMock() {
    ethers = this.ethers;
    let json = require('./.artifacts/CompoundV2/CompoundOracleMock.json')
    const [owner] = await ethers.getSigners()
    Oracle = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    oracle = await Oracle.deploy()
    return oracle;
}

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */
async function getInterestRateModel() {
    ethers = this.ethers;
    let json = require('./.artifacts/CompoundV2/WhitePaperInterestRateModel.json')
    const [owner] = await ethers.getSigners()
    Interest = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    interest = await Interest.deploy(0, BigInt("200000000000000000"))
    return interest;
}

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */
async function getCEther(comptrollerAddress, interestRateModelAddress) {
    ethers = this.ethers;
    let json = require('./.artifacts/CompoundV2/CEther.json')
    const [owner] = await ethers.getSigners()
    CEther = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    cEther = await CEther.deploy(comptrollerAddress, interestRateModelAddress, BigInt("200000000000000000000000000"), "Compound Ether", "cEth", 8)
    return cEther;

}

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */

async function getCToken(comptrollerAddress, interestRateModelAddress, assetAddress) {
    ethers = this.ethers;
    let json = require('./.artifacts/CompoundV2/CErc20.json')
    const [owner] = await ethers.getSigners()
    CErc20 = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    cErc20 = await CErc20.deploy(assetAddress, comptrollerAddress, interestRateModelAddress, BigInt("200000000000000"), "Compound USD Coin", "cUSDC", 8)
    return cErc20;

}

/**
 * @deprecated Since version 1.3.10. Will be deleted in next version.
 */
async function getCompoundV2() {
    const [owner] = await ethers.getSigners()
    let timelock = await getCompoundTimelockV2(owner.address, 172800)
    let compProxy = await getCompoundUnitrollerV2()
    let compImpl = await getCompoundComptrollerV2()
    let oracle = await getCompoundOracleMock()
    await compProxy._setPendingImplementation(compImpl.address)
    await compImpl._become(compProxy.address, oracle.address, BigInt("0x6f05b59d3b20000"), 20, false)
    let json = require('./.artifacts/CompoundV2/Comptroller.json')
    let unitroller = await ethers.getContractAt(json.abi, compProxy.address, owner);
    let interestRate = await getInterestRateModel();
    let cEther = await getCEther(unitroller.address, interestRate.address)
    await unitroller._supportMarket(cEther.address)
    let USDC = await getERC20("USD Coin", "USDC", 6);
    let cUSDC = await getCToken(unitroller.address, interestRate.address, USDC.address)
    await unitroller._supportMarket(cEther.address)
    return {
        timelock: timelock,
        unitroller: unitroller,
        oracle: oracle,
        cEther: cEther,
        cUSDC: cUSDC
    }
}

async function createCompoundV2() {
    const {createNewCompoundV2} = require('./compoundv2.js');
    return createNewCompoundV2(ethers);
}