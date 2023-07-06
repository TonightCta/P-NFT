import { message } from "antd";
import { Type, ethereum } from "./types";
import { useContext, useEffect } from "react";
import { PNft } from "../App";
export const useMetamask = () => {
    const { dispatch } = useContext(PNft);
    useEffect(() => {
        setTimeout(() => {
            if (!ethereum) {
                return
            }
            ethereum.on('accountsChanged', (accounts: string[]) => {
                dispatch({
                    type: Type.SET_ADDRESS,
                    payload: {
                        address: accounts.length > 0 ? accounts[0] : null
                    }
                });
                if (accounts.length === 0) {
                    window.location.reload();
                }
            });
            ethereum.on('chainChanged', (res: any) => {
                console.log(res)
            });
        }, 200)
    }, []);
    //连接钱包
    const connectMetamask = async () => {
        if (!ethereum) {
            message.error('reject');
            return
        };
        try {
            const result = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log(result)
            dispatch({
                type: Type.SET_ADDRESS,
                payload: {
                    address: result[0]
                }
            });
        } catch (err: any) {
            console.log(err)
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
