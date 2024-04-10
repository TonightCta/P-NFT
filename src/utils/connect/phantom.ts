import { message } from "antd";
import { Type } from "../types";
import { useContext } from "react";
import { PNft } from "../../App";
import { ProfileService } from "../../request/api";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';


export const usePhantom = () => {
  const { dispatch } = useContext(PNft);
  const wallet = new PhantomWalletAdapter;
  const connection = new Connection(clusterApiUrl('mainnet-beta'));
  const updateAddress = async (_address: string) => {
    if (!_address) {
      return
    }
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
  //Connect Wallet
  const connectPhantom = async () => {
    try {
      await wallet.connect();
      const publicKey = wallet.publicKey as PublicKey;
      dispatch({
        type: Type.SET_WALLET,
        payload: {
          wallet: 'sol'
        }
      });
      dispatch({
        type: Type.SET_EVM,
        payload: {
          evm:'1'
        }
      })
      updateNetwork('Solana');
      updateAddress(publicKey.toString())
      dispatch({
        type: Type.SET_BALANCE,
        payload: {
          balance: '0.0000'
          // balance: String((+balance / 1e18).toFixed(4))
        }
      })
      // return
      const info = await connection.getAccountInfo(publicKey);
      console.log(info);
      const balance = await connection.getTokenAccountBalance(publicKey);
      console.log(balance)
      dispatch({
        type: Type.SET_BALANCE,
        payload: {
          balance: '0.0000'
          // balance: String((+balance / 1e18).toFixed(4))
        }
      })
    } catch (err: any) {
      console.log(err)
      message.error(err.message);
    }
  }
  return {
    connectPhantom
  }
};
