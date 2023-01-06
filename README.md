# Mock Kit for Hardhat tests
## Install
Create hardhat project  
Add this package with npm or yarn
#### Inside test script:
```
const {ethers} = require('hardhat')
const {Mock} = require('@todesstille/mock')
const mock = new Mock(ethers)
```
## Usage
### ERC20
```
erc20 = await mock.getERC20(name, symbol, decimals) // Creates contract instance
await erc20.mint(address) // Mint tokens to any address you need
```
### Chainlink Pricefeed
```
pricefeed = await mock.getChainlinkPricefeed(decimals, description, version, price)
await pricefeed.updateOracle(newPrice)
await pricefeed.latestAnswer()

```
### Wrapped Ether
```
weth = await mock.getWeth9();
```
### UniswapV2
```
uniswap = await mock.createUniswapV2(weth.address, admin.address)
```
Factory and Router instances are available by uniswap.factory and uniswap.router

To get a new or existent pair:
```
token1 = await mock.getERC20("Token1", "TKN1", 18);
token2 = await mock.getERC20("Token2", "TKN2", 18);
pair = await uniswap.createOrGetPair(token1.address, token2.address)
```

### UniswapV3
```
uniswap = await mock.createUniswapV3(weth.address)
```
Factory, SwapRouter and NonfungiblePositionManager instances are available by uniswap.factory, uniswap.router and uniswap.nft

To get a new or existent pool:
```
token1 = await mock.getERC20("Token1", "TKN1", 18);
token2 = await mock.getERC20("Token2", "TKN2", 18);
fee = 500;
pool = await uniswap.createOrGetPool(token1.address, token2.address, fee)
```

Initialize pool with ratio:
```
ratio = "0x01000000000000000000000000" // 1:1 ratio
await uniswap.initializePool(pool, ratio)
```

Fill pool from TICK_MIN to TICK_MAX
```
await token1.approve(nft.address, amount1)
await token2.approve(nft.address, amount2)
result = await uniswap.defaultAddLiquidity(pool, amount1, amount2, userAddress);
// Tokens in the pool located in the alphabetic order, so amount1 as the amount of token with a lower address.
```

### Chainlink VRF v1
```
link = await mock.getLinkToken();
coordinator = await mock.getVrfV1(link.address) 
await coordinator.register("mainnet")
```
registers keyHash for mainnet. Also availabe "polygon", "bnb" etc
```
contract = await Contract.deploy(coordinator.address, link.address) 
```
Deploy your contract. It must implement VRFConsumerBase.sol
```
amount =  await ethers.utils.parseUnits("2.0", 18)
await link.transfer(contract.address, amount) // Sent 2 LINK to your contract
await contract.requestRandomness("0xaa77729d3466ca35ae8d28b3bbac7cc36a5031efdc430821c02bc31a238af445", amount) 
```
Mainnet keyHash for 2 LINK
```
await coordinator.fulfill() // Reply from VRF oracle to all unparsed requests
```