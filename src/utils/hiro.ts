import { useContext } from "react";
import { userSession } from "./user.session";
import { showConnect } from '@stacks/connect';
import { PNft } from "../App";
import { Type } from "./types";

export const useHiro = () => {
    const { dispatch } = useContext(PNft);
    const win: any = window;
    const connectHiro = async () => {
        const myAppName = 'My Stacks Web-App'; // shown in wallet pop-up
        const myAppIcon = window.location.origin + '/my_logo.png';
        showConnect({
            userSession,
            appDetails: {
                name: myAppName,
                icon: myAppIcon,
            },
            onFinish: (res: any) => {
                const accounts = [res['authResponsePayload']['profile']['stxAddress']['mainnet']]
                dispatch({
                    type: Type.SET_ADDRESS,
                    payload: {
                        address: accounts.length > 0 ? accounts[0] : null
                    }
                });
                // window.location.reload(); // WHEN user confirms pop-up
            },
            onCancel: () => {
                console.log('oops'); // WHEN user cancels/closes pop-up
            },
        });
        // const result: {
        //     result: {
        //         addresses: any[]
        //     }
        // } = await win.btc?.request('getAddresses');
        // console.log(result);
        // result.result.addresses.forEach((e) => {
        //     if (e.symbol === 'STX') {
        //         console.log(e.address);
        //         dispatch({
        //             type: Type.SET_ADDRESS,
        //             payload: {
        //                 address: e.address
        //             }
        //         });
        //         return
        //     }
        // })
    };
    return {
        connectHiro
    }
}