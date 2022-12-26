exports.createNewUniswapV2 = async function createNewUniswapV2(ethers, weth9Address, feeToAddress) {
    const [owner] = await ethers.getSigners()
    const factory = await getUniswapV2Factory(ethers, feeToAddress)
    const router = await getUniswapV2Router(ethers, factory.address, weth9Address)
    return {
        _ethers: ethers,
        factory: factory,
        router: router,
        createPair: async function createPair(address1, address2) {
            let json = require('./.artifacts/UniswapV2Pair.json')
            const [owner] = await this._ethers.getSigners()
            let pairAddress = await this.factory.getPair(address1, address2)
            if (pairAddress === "0x0000000000000000000000000000000000000000" ) {
                pairAddress = await this.factory.callStatic.createPair(address1, address2)
                await this.factory.createPair(address1, address2)
                return await this._ethers.getContractAt(json.abi, pairAddress, owner);
            } else {
                throw new Error("UniswapV2: Pair already exists")
            }
            
        },
        getPair: async function getPair(address1, address2) {
            let pairAddress = await this.factory.getPair(address1, address2);
            if (pairAddress === "0x0000000000000000000000000000000000000000" ) {
                throw new Error("UniswapV2: No such pair")
            }
            let json = require('./.artifacts/UniswapV2Pair.json')
            const [owner] = await this._ethers.getSigners()
            return await this._ethers.getContractAt(json.abi, pairAddress, owner);
        },
        createOrGetPair: async function createOrGetPair(address1, address2) {
            let json = require('./.artifacts/UniswapV2Pair.json')
            const [owner] = await this._ethers.getSigners()
            let pairAddress = await this.factory.getPair(address1, address2)
            if (pairAddress === "0x0000000000000000000000000000000000000000" ) {
                pairAddress = await this.factory.callStatic.createPair(address1, address2)
                await this.factory.createPair(address1, address2)
                return await this._ethers.getContractAt(json.abi, pairAddress, owner);
            } else {
                return await this._ethers.getContractAt(json.abi, pairAddress, owner);
            }
        },
    }
}

async function getUniswapV2Factory(ethers, beneficiary) {
    let json = require('./.artifacts/UniswapV2Factory.json')
    const [owner] = await ethers.getSigners()
    let Factory = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    let factory = await Factory.deploy(beneficiary)
    return factory
}

async function getUniswapV2Router(ethers, factoryAddress, WETHAddress) {
    let json = require('./.artifacts/UniswapV2Router02.json')
    const [owner] = await ethers.getSigners()
    let Router = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    let router = await Router.deploy(factoryAddress, WETHAddress);
    return router
}