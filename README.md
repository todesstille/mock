# Mock Contracts library to test with Hardhat
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
### UniswapV2
Create Factory contract:
```
factory = await mock.getUniswapV2(admin.address);
```
Create pair contract with factory for token1 and token2  
(The first parameter of the function is factory itself, not its address)
```
token1 = await mock.getERC20("Token1", "TKN1", 18);
token2 = await mock.getERC20("Token2", "TKN2", 18);
pair = await mock.getUniswapV2Pair(factory, token1.address, token2.address)
```