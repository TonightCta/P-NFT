import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { useContext } from 'react'
import Web3 from 'web3'
import { PNft } from '../../App'
import { Type, web3 } from '../types'
import { ProfileService } from '../../request/api'

const APP_NAME = 'Pizzap'
const APP_LOGO_URL = 'https://example.com/logo.png'
export const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/79d66dc5615d401b9854729385502ca7`
export const DEFAULT_CHAIN_ID = 1;

export const coinbaseWallet = new CoinbaseWalletSDK({
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
        const data: any = await ethereum.request({
            method: 'eth_requestAccounts'
        });
        dispatch({
            type: Type.SET_WALLET,
            payload: {
                wallet: 'coinbase'
            }
        })
        dispatch({
            type: Type.SET_ADDRESS,
            payload: {
                address: data[0]
            }
        });
        const balance = await web3.eth.getBalance(data[0]);
        dispatch({
            type: Type.SET_BALANCE,
            payload: {
                balance: String((+balance / 1e18).toFixed(4))
            }
        })
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
        });
        ethereum.on('accountsChanged', async (accounts: string[]) => {
            if (accounts.length > 0) {
                const account = await ProfileService({
                    user_address: accounts[0]
                });
                dispatch({
                    type: Type.SET_ACCOUNT,
                    payload: {
                        account: account.data
                    }
                });
                const balance = await web3.eth.getBalance(accounts[0]);
                dispatch({
                    type: Type.SET_BALANCE,
                    payload: {
                        balance: String((+balance / 1e18).toFixed(4))
                    }
                })
            }
            dispatch({
                type: Type.SET_ADDRESS,
                payload: {
                    address: accounts.length > 0 ? accounts[0] : null
                }
            });

            dispatch({
                type: Type.SET_CHAIN,
                payload: {
                    chain: web3.utils.hexToNumberString(ethereum?.chainId)
                }
            })
            if (accounts.length === 0) {
                window.location.reload();
            }
        });
        ethereum.on('chainChanged', (res: any) => {
            dispatch({
                type: Type.SET_CHAIN,
                payload: {
                    chain: String(Number(res))
                }
            });
        });
    };
    return {
        connectCoinbase
    }
}


