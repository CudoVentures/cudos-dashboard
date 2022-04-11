import chainConfigTestnet from './chain_config.testnet.json'
import chainConfigMainnet from './chain_config.mainnet.json'
import chainConfigTemp from './chain_config_temp.json'
import generalConfig from './general_config.json'

/**
 * Helper function to return different configs based on the same chain
 * @returns config
 */
const getChainConfig = () => {
  if (import.meta.env.VITE_CHAIN_STATUS === 'mainnet') {
    return chainConfigMainnet
  }
  return chainConfigTestnet
}

const chainConfig = getChainConfig()

export { chainConfig, generalConfig, chainConfigTemp }
