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
Create Router, Factory and Weth9 simultaniously:
```
[router, factory, weth] = await mock.getUniswapV2(admin.address);
```
Only Factory:
```
factory = await mock.getUniswapV2Factory(admin.address);
```
Router, using Factory and WETH instances:
```
router = await mock.getUniswapV2Router(factory, WETH)
```
Pair contract for tokens using factory contract  
(The first parameter of the function is a factory instance, not its address)
```
token1 = await mock.getERC20("Token1", "TKN1", 18);
token2 = await mock.getERC20("Token2", "TKN2", 18);
pair = await mock.getUniswapV2Pair(factory, token1.address, token2.address)
```