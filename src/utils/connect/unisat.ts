import { message } from "antd";
import { useContext } from "react";
import { PNft } from "../../App";
import { Type } from "../types";
import { ProfileService } from "../../request/api";
import { useNavigate } from "react-router-dom";

export const useUnisat = () => {
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
    const connectUnisat = async () => {
        if (!win.unisat) {
            message.error('Unisat Wallet is not installed on your browser yet');
            return
        };
        try {
            const result = await win.unisat.requestAccounts();
            dispatch({
                type: Type.SET_WALLET,
                payload: {
                    wallet: 'btc'
                }
            });
            const balance = await win.unisat.getBalance();
            dispatch({
                type:Type.SET_BALANCE,
                payload:{
                    balance:String(balance.total.toFixed(4))
                }
            })
            const network = await win.unisat.getNetwork();
            await updateNetwork(network);
            await updateAddress(result[0]);
            win.unisat.on('accountsChanged', (accounts: Array<string>) => {
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
                updateAddress(accounts[0])
            });
            win.unisat.on('networkChanged', (network: string) => {
                updateNetwork(network)
            })
        } catch (error: any) {
            message.error(error.message)
        }
    };
    const switchNetworkUnisat = async (_chian: string) => {
        try {
            await win.unisat.switchNetwork(_chian);
        } catch (error: any) {
            message.error(error.message)
        }
    }
    return {
        connectUnisat,
        switchNetworkUnisat
    }
}