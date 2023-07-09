import { message } from "antd";
import { Type, ethereum } from "./types";
import { useContext, useEffect } from "react";
import { PNft } from "../App";
import { ProfileService, QueryFile } from "../request/api";
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
            account.data.avatar_minio && setAvatar();
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
