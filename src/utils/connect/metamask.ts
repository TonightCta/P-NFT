import { message } from "antd";
import { Type, web3 } from "../types";
import { useContext } from "react";
import { PNft } from "../../App";
import { ProfileService, QueryFile } from "../../request/api";
// import { MetaMaskSDK } from '@metamask/sdk';
import Web3 from "web3";

// const MMSDK = new MetaMaskSDK({
//     dappMetadata: {
//         name: 'Pizzap',
//         url: 'https://pizzap.io/'
//     },
//     infuraAPIKey:'79d66dc5615d401b9854729385502ca7'
// });

export const useMetamask = () => {
    // const ethereum = MMSDK.getProvider();
    const { dispatch } = useContext(PNft);
    //连接钱包
    const connectMetamask = async () => {
        if (!window?.ethereum) {
            message.error('reject');
            return
        };
        const ethereum = window.ethereum;
        const metamaskProvider = ethereum?.providers?.find((p: any) => p.isMetaMask);
        if (metamaskProvider && typeof ethereum.selectedProvider !== 'undefined') {
            ethereum.selectedProvider = metamaskProvider;
            ethereum.setSelectedProvider(metamaskProvider)
        };
        dispatch({
            type: Type.SET_WEB3,
            payload: {
                web3: new Web3(ethereum as any)
            }
        });
        try {
            const result: any = await ethereum.request({ method: 'eth_requestAccounts' });
            dispatch({
                type: Type.SET_ADDRESS,
                payload: {
                    address: result[0]
                }
            });
            const account = await ProfileService({
                user_address: result[0]
            });
            dispatch({
                type: Type.SET_ACCOUNT,
                payload: {
                    account: account.data
                }
            });
            const setAvatar = async () => {
                const result = await QueryFile({
                    name: account.data.avatar_minio
                });
                dispatch({
                    type: Type.SET_AVATAR,
                    payload: {
                        avatar: result.data
                    }
                })
            };
            dispatch({
                type: Type.SET_CONNECT_MODAL,
                payload: {
                    connect_modal: false
                }
            });
            dispatch({
                type: Type.SET_CHAIN,
                payload: {
                    chain: web3.utils.hexToNumberString(ethereum?.chainId)
                }
            })
            account.data.avatar_minio && setAvatar();
        } catch (err: any) {
            message.error(err.message);
            // switch (err.code) {
            //     case 4001:
            //         message.warning('You have deauthorized')
            //         break;
            //     default:
            //         message.warning('Network Error')
            // }
        }
    }
    return {
        connectMetamask
    }
};

export const useListen = () => {
    const { dispatch } = useContext(PNft);
    const listen = () => {
        const ethereum = window?.ethereum;
        setTimeout(() => {
            if (!ethereum) {
                return
            };
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
        }, 200)
    }
    return {
        listen: listen
    }
}
