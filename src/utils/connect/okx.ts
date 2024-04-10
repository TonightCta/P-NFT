import { useContext } from "react";
import { PNft } from "../../App";
import { Type } from "../types";
import { ProfileService } from "../../request/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const useOKX = () => {
    const win: any = window;
    const { dispatch } = useContext(PNft);
    const navigate = useNavigate();
    const updateAddress = async (_address: string) => {
        dispatch({
            type: Type.SET_ADDRESS,
            payload: {
                address: _address
            }
        });
        const account = await ProfileService({
            user_address: _address
        });
        dispatch({
            type: Type.SET_ACCOUNT,
            payload: {
                account: account.data
            }
        });
    };
    const updateNetwork = async (_chain: string) => {
        dispatch({
            type: Type.SET_CHAIN,
            payload: {
                chain: _chain
            }
        });
    }
    const connectOKX = async () => {
        if (!win.okxwallet) {
            message.error('OKX Wallet is not installed on your browser yet');
            return
        };
        try {
            const result = await win.okxwallet.bitcoin.connect();
            dispatch({
                type: Type.SET_WALLET,
                payload: {
                    wallet: 'btc'
                }
            });
            dispatch({
              type: Type.SET_EVM,
              payload: {
                evm:'1'
              }
            })
            await updateAddress(result.address);
            const balance = await win.okxwallet.bitcoin.getBalance();
            dispatch({
                type:Type.SET_BALANCE,
                payload:{
                    balance:String(balance.total.toFixed(4))
                }
            })
            const network = await win.okxwallet.bitcoin.getNetwork();
            updateNetwork(network);
            win.okxwallet.bitcoin.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length < 1) {
                    dispatch({
                        type: Type.SET_ADDRESS,
                        payload: {
                            address: ''
                        }
                    });
                    dispatch({
                        type: Type.SET_WALLET,
                        payload: {
                            wallet: ''
                        }
                    });
                    navigate('/');
                    return
                }
                updateAddress(accounts[0]);
            })
        } catch (error: any) {
            message.error(error.message);
        }
    };
    return {
        connectOKX
    }
}