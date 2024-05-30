import { useContext } from "react";
import { PNft } from "../App";
import { Network, SupportNetwork } from "../utils";
import { Type, web3 } from "../utils/types";
import { message } from "antd";
import { useSDK } from "@metamask/sdk-react";
import { ethereum } from "../utils/types";
import { DEFAULT_CHAIN_ID, DEFAULT_ETH_JSONRPC_URL, coinbaseWallet } from '../utils/connect/coinbase'
// Switch public chain
export const useSwitchChain = () => {
    const { state, dispatch } = useContext(PNft);
    const { provider } = useSDK();
    const ethereumCoinbase = coinbaseWallet.makeWeb3Provider(
        DEFAULT_ETH_JSONRPC_URL,
        DEFAULT_CHAIN_ID
    );
    const switchInner = async (chain_id: number): Promise<void> => {
        const withChainID: any = SupportNetwork.filter((item: Network) => {
            return item.chain_id === chain_id
        });
        const ethereumV2 = state.wallet === 'coinbase' && ethereumCoinbase || state.wallet === 'metamask' &&  provider || ethereum;
        try {
            const result = await ethereumV2.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: web3.utils.toHex(chain_id) }],
            });
            dispatch({
                type: Type.SET_CHAIN,
                payload: {
                    chain: String(chain_id)
                }
            })
            return result
        } catch (error: any) {
            const add = async () => {
                const params = [
                    {
                        chainId: web3.utils.toHex(chain_id), // A 0x-prefixed hexadecimal string
                        chainName: withChainID[0].chain_name,
                        nativeCurrency: {
                            name: withChainID[0].nativeCurrency.name,
                            symbol: withChainID[0].nativeCurrency.name, // 2-6 characters long
                            decimals: withChainID[0].nativeCurrency.decimals,
                        },
                        rpcUrls: withChainID[0].rpcUrls,
                        blockExplorerUrls: withChainID[0].blockExplorerUrls,
                    }
                ];
                try {
                    await ethereumV2.request({
                        method: "wallet_addEthereumChain",
                        params: params,
                    });
                    await ethereumV2.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: web3.utils.toHex(chain_id) }],
                    });
                    dispatch({
                        type: Type.SET_CHAIN,
                        payload: {
                            chain: String(chain_id)
                        }
                    })
                } catch (addError) {
                    console.log(addError)
                    // handle "add" error
                }
            }
            switch (error.code) {
                case 4902:
                    add();
                    break;
                case -32603:
                    add();
                    break;
                case -32002:
                    message.error('You have pending wallet operations');
                    break;
                case 4001:
                    message.error('You have canceled');
                    break;
                default:
                    console.log(error)
            }
            return error
        }
    };
    return {
        switchC: switchInner
    }
};