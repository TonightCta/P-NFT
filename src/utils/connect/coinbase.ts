import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { useContext } from 'react'
import Web3 from 'web3'
import { PNft } from '../../App'
import { Type, web3 } from '../types'
import { ProfileService } from '../../request/api'

const APP_NAME = 'Pizzap'
const APP_LOGO_URL = 'https://example.com/logo.png'
const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/79d66dc5615d401b9854729385502ca7`
const DEFAULT_CHAIN_ID = 1;

const coinbaseWallet = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    darkMode: false
})


export const useCoinbase = () => {
    const ethereum = coinbaseWallet.makeWeb3Provider(
        DEFAULT_ETH_JSONRPC_URL,
        DEFAULT_CHAIN_ID
    )
    const { dispatch } = useContext(PNft);
    const connectCoinbase = async () => {
        dispatch({
            type: Type.SET_ETHEREUM,
            payload: {
                ethereum: ethereum
            }
        });
        dispatch({
            type: Type.SET_WEB3,
            payload: {
                web3: new Web3(ethereum)
            }
        });
        const coinbaseProvider = window.ethereum?.providers?.find((p: any) => p.isCoinbaseWallet);
        if (coinbaseProvider && typeof window.ethereum.selectedProvider !== 'undefined') {
            window.ethereum.selectedProvider = coinbaseProvider;
            window.ethereum.setSelectedProvider(coinbaseProvider)
        };
        const data: any = await ethereum.request({
            method: 'eth_requestAccounts'
        });
        dispatch({
            type: Type.SET_ADDRESS,
            payload: {
                address: data[0]
            }
        });
        dispatch({
            type: Type.SET_CONNECT_MODAL,
            payload: {
                connect_modal: false
            }
        })
        const account = await ProfileService({
            user_address: data[0]
        });
        dispatch({
            type: Type.SET_ACCOUNT,
            payload: {
                account: account.data
            }
        });
        dispatch({
            type: Type.SET_CHAIN,
            payload: {
                chain: web3.utils.hexToNumberString(ethereum?.chainId)
            }
        })
    };
    return {
        connectCoinbase
    }
}


