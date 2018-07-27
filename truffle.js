
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
      port:8545,
      from: "0x8EadeD83C2137c43f7Ff277c69f02e34A40Dd835"
    }
  }, coverage: {
    host: "localhost",
    network_id: "*",
    port: 8545,         // <-- If you change this, also set the port option in .solcover.js.
    gas: 0xfffffffffff, // <-- Use this high gas value
    gasPrice: 0x01      // <-- Use this low gas price
  }
};
