require('dotenv').config()
const path = require("path");
const dev_wallet_1_mnemonic = process.env.DEV_WALLET_1_MNEMONIC
const dev_wallet_2_mnemonic = process.env.DEV_WALLET_2_MNEMONIC
const prod_wallet = process.env.PROD_WALLET_MNEMONIC
const projectId1 = process.env.INFURA_PROJECT_ID1
const projectI2 = process.env.INFURA_PROJECT_ID2
const etherscanAPIKey = process.env.ETHERSCAN_API_KEY
const HDWalletProvider = require("@truffle/hdwallet-provider");

// https://www.myetherwallet.com/wallet/access

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      network_id: "*",
      port: 8545
    },
    // develop: {
    //   host: "127.0.0.1",
    //   network_id: 5777,
    //   port: 7545,
    //   gas: 2000000,
    //   gasLimit: 300000
    // },
    rinkeby: {
      provider: () => new HDWalletProvider(dev_wallet_1_mnemonic, `https://rinkeby.infura.io/v3/${projectId1}`),
      network_id: 4,       // Rinkeby's id
      gas: 2000000,        
      gasPrice: 10*10**9,  // 50 gwei (in wei) (default: 100 gwei)
      confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    goerli: {
      provider: () => new HDWalletProvider(dev_wallet_1_mnemonic, `https://goerli.infura.io/v3/${projectId1}`),
      network_id: 5,       // Goerli's id
      gas: 2000000,        
      gasPrice: 10*10**9,  // 50 gwei (in wei) (default: 100 gwei)
      confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    mainnet: {
      provider: () => new HDWalletProvider(prod_wallet, `https://mainnet.infura.io/v3/${projectId1}`),
      network_id: 1,       // Mainnet's id
      gas: 6000000,        
      gasPrice: 25000000000,  // 1 gwei (in wei) (default: 100 gwei)
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 100,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc:{
      version: '0.8.17',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: etherscanAPIKey
  },
};

