import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId
const projectId = '9ca823211b5d95d68fbc4bd92e55f960'

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}
const plian = {
    chainId: 8007736,
    name: 'Plian Subchain 1',
    currency: 'Pi',
    explorerUrl: 'https://piscan.plian.org/?chain=1',
    rpcUrl: 'https://mainnet.plian.io/child_0'
}
const filecoin = {
    chainId: 314,
    name: 'Filecoin',
    currency: 'FIL',
    explorerUrl: 'https://explorer.glif.io/',
    rpcUrl: 'https://api.node.glif.io/'
}
const op = {
    chainId: 10,
    name: 'Optimism',
    currency: 'ETH',
    explorerUrl: 'https://optimistic.etherscan.io',
    rpcUrl: 'https://optimism.publicnode.com'
}
const platON = {
    chainId: 210425,
    name: 'PlatON',
    currency: 'LAT',
    explorerUrl: 'https://scan.platon.network',
    rpcUrl: 'https://openapi2.platon.network/rpc'
}

// 3. Create modal
const metadata = {
    name: 'Pizzap',
    description: 'Pizzap is a user-benefit-oriented and mass-adopted AI ecosystem. Members  can create, show and trade NFTs in this community, as well as build personal art brand in MetaVerse.',
    url: 'https://pizzap.io',
    icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [mainnet, plian, filecoin, op, platON],
    projectId,
    themeMode: 'light'
})

// export default {};