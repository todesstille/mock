exports.createNewUniswapV3 = async function createNewUniswapV2(ethers) {
    const [owner] = await ethers.getSigners()
    const factory = await getUniswapV3Factory(ethers)
    return {
        _ethers: ethers,
        factory: factory,
    }
}

async function getUniswapV3Factory(ethers) {
    let json = require('./.artifacts/UniswapV3Factory.json')
    const [owner] = await ethers.getSigners()
    let Factory = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    let factory = await Factory.deploy()
    return factory
}