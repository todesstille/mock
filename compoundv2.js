exports.createNewCompoundV2 = async function createNewCompoundV2(ethers) {
    const [owner] = await ethers.getSigners()
    let timelock = await getCompoundTimelockV2(ethers, owner.address, 172800)
    let compProxy = await getCompoundUnitrollerV2(ethers)
    let compImpl = await getCompoundComptrollerV2(ethers)
    let oracle = await getCompoundOracleMock(ethers)
    await compProxy._setPendingImplementation(compImpl.address)
    await compImpl._become(compProxy.address, oracle.address, BigInt("0x6f05b59d3b20000"), 20, false)
    let json = require('./.artifacts/CompoundV2/Comptroller.json')
    let unitroller = await ethers.getContractAt(json.abi, compProxy.address, owner);
    let interestRate = await getInterestRateModel(ethers);
    //let cEther = await getCEther(ethers, unitroller.address, interestRate.address)
    await unitroller._supportMarket(cEther.address)
    // let USDC = await getERC20("USD Coin", "USDC", 6);
    // let cUSDC = await getCToken(unitroller.address, interestRate.address, USDC.address)
    await unitroller._supportMarket(cEther.address)
    return {
        _ethers: ethers,
        timelock: timelock,
        oracle: oracle,
        interestRate: interestRate,
        unitroller: unitroller,
        getCEther: async function getCEther() {
            let json = require('./.artifacts/CompoundV2/CEther.json')
            const [owner] = await this._ethers.getSigners()
            CEther = await this._ethers.getContractFactory(json.abi, json.bytecode, owner)
            cEther = await CEther.deploy(this.unitroller.address, this.interestRate.address, BigInt("200000000000000000000000000"), "Compound Ether", "cEth", 8)
            return cEther;
        
        },
        getCToken: async function getCToken(token) {
            let json = require('./.artifacts/CompoundV2/CErc20.json')
            const [owner] = await this._ethers.getSigners()
            CErc20 = await this._ethers.getContractFactory(json.abi, json.bytecode, owner)
            cErc20 = await CErc20.deploy(token.address, this.unitroller.address, this.interestRate.address, BigInt("200000000000000"), "Compound " + await token.name(), "c" + await token.symbol(), 8)
            return cErc20;
        
        }
    }
}

//
async function getCompoundTimelockV2(ethers, admin, delay) {
    let json = require('./.artifacts/CompoundV2/Timelock.json')
    const [owner] = await ethers.getSigners()
    Timelock = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    timelock = await Timelock.deploy(admin, delay)
    return timelock;
}

//
async function getCompoundUnitrollerV2(ethers) {
    let json = require('./.artifacts/CompoundV2/Unitroller.json')
    const [owner] = await ethers.getSigners()
    Unitroller = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    unitroller = await Unitroller.deploy()
    return unitroller;
}

//
async function getCompoundComptrollerV2(ethers) {
    let json = require('./.artifacts/CompoundV2/Comptroller.json')
    const [owner] = await ethers.getSigners()
    Comptroller = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    comptroller = await Comptroller.deploy()
    return comptroller;
}

async function getCompoundOracleMock(ethers) {
    let json = require('./.artifacts/CompoundV2/CompoundOracleMock.json')
    const [owner] = await ethers.getSigners()
    Oracle = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    oracle = await Oracle.deploy()
    return oracle;
}

async function getInterestRateModel(ethers) {
    let json = require('./.artifacts/CompoundV2/WhitePaperInterestRateModel.json')
    const [owner] = await ethers.getSigners()
    Interest = await ethers.getContractFactory(json.abi, json.bytecode, owner)
    interest = await Interest.deploy(0, BigInt("200000000000000000"))
    return interest;
}
