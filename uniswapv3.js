exports.createNewUniswapV3 = async function createNewUniswapV3(ethers, weth9Address) {
    const [owner] = await ethers.getSigners()
    const factory = await getUniswapV3Factory(ethers)
    const router = await getUniswapV3Router(ethers, factory.address, weth9Address)
    const nft = await getUniswapNftFactory(ethers, factory.address, weth9Address)
    return {
        _ethers: ethers,
        factory: factory,
        router: router,
        nft: nft,
        createPool: async function createPool(address1, address2, fee) {
            let json = require('./.artifacts/UniswapV3Pool.json')
            const [owner] = await this._ethers.getSigners()
            let poolAddress = await this.factory.getPool(address1, address2, fee)
            if (poolAddress === "0x0000000000000000000000000000000000000000" ) {
                poolAddress = await this.factory.callStatic.createPool(address1, address2, fee)
                await this.factory.createPool(address1, address2, fee)
                return await this._ethers.getContractAt(json.abi, poolAddress, owner);
            } else {
                throw new Error("UniswapV3: Pool already exists")
            }
            
        },
        getPool: async function getPool(address1, address2, fee) {
            let poolAddress = await this.factory.getPool(address1, address2, fee);
            if (poolAddress === "0x0000000000000000000000000000000000000000" ) {
                throw new Error("UniswapV3: No such pool")
            }
            let json = require('./.artifacts/UniswapV3Pool.json')
            const [owner] = await this._ethers.getSigners()
            return await this._ethers.getContractAt(json.abi, poolAddress, owner);
        },
        createOrGetPool: async function createOrGetPool(address1, address2, fee) {
            let json = require('./.artifacts/UniswapV3Pool.json')
            const [owner] = await this._ethers.getSigners()
            let poolAddress = await this.factory.getPool(address1, address2, fee)
            if (poolAddress === "0x0000000000000000000000000000000000000000" ) {
                poolAddress = await this.factory.callStatic.createPool(address1, address2, fee)
                await this.factory.createPool(address1, address2, fee)
                return await this._ethers.getContractAt(json.abi, poolAddress, owner);
            } else {
                return await this._ethers.getContractAt(json.abi, poolAddress, owner);
            }
        },
        initializePool: async function initializePool(pool, ratio) {
            await pool.initialize(ratio);
        },
        defaultAddLiquidity: async function defaultAddLiquidity(pool, amount0, amount1, address) {
            let tickSpacing = (await pool.tickSpacing());
            let maxTick = 887272 - (887272 % tickSpacing);
            let minTick = -maxTick;
            const blockNumBefore = await this._ethers.provider.getBlockNumber();
            const blockBefore = await this._ethers.provider.getBlock(blockNumBefore);
            const timestampBefore = blockBefore.timestamp;
            let result = await this.nft.callStatic.mint([await pool.token0(), await pool.token1(), await pool.fee(), minTick, maxTick, amount0, amount1, 0, 0, address, timestampBefore + 100]);
            await this.nft.mint([await pool.token0(), await pool.token1(), await pool.fee(), minTick, maxTick, amount0, amount1, 0, 0, address, timestampBefore + 100]);
            return result;
        }
    }
}

async function getUniswapV3Factory(ethers) {
    let json = require('./.artifacts/UniswapV3Factory.json')
    const [owner] = await ethers.getSigners()
    let Factory = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    let factory = await Factory.deploy()
    return factory
}

async function getUniswapV3Router(ethers, factoryAddress, WETHAddress) {
    let json = require('./.artifacts/SwapRouter.json')
    const [owner] = await ethers.getSigners()
    let Router = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    let router = await Router.deploy(factoryAddress, WETHAddress);
    return router
}

async function getUniswapNftFactory(ethers, factoryAddress, WETHAddress) {
    let json = require('./.artifacts/NonfungiblePositionManager.json')
    const [owner] = await ethers.getSigners()
    let Nft = await ethers.getContractFactory(json.abi, json.bytecode, owner);
    let nft = await Nft.deploy(factoryAddress, WETHAddress);
    return nft;
}