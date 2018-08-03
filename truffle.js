
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 4000000,
      network_id: "*"
    },
    kovan: {
      network_id: 42,
      host: "localhost",
      port: 8545,
      from: "0x9cc8d926e9f15e82b09114c7f6abfdfed5f9e9f8"
    },
    live: {
      network_id: 1,
      host: "localhost",
      port: 8545,
      from: "0x8EadeD83C2137c43f7Ff277c69f02e34A40Dd835"
    },
    coverage: {
      port: 8555,
      host: "localhost",
      network_id: "*",
      gas: 0xffffffff, // <-- 4,000,000 high gas value
      gasPrice: 0x03     // <-- Use this low gas price
    }
  }
};
