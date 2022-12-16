# Mock Contracts library to test with Hardhat
## Install
#### Create hardhat project
#### Add this package with npm or yarn
#### Inside test script:
```
const {ethers} = require('hardhat')
const Mock = require('@todesstille/mock')
const mock = new Mock(ethers)
```
## Usage
### ERC20
```erc20 = await mock.getERC20(name, symbol, decimals) // Creates contract instance
await erc20.mint(address) // Mint tokens to any address you need
```

