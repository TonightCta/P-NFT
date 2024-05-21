import { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { PNft } from "../App";
import { useSDK } from "@metamask/sdk-react";
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_ETH_JSONRPC_URL,
  coinbaseWallet,
} from "../utils/connect/coinbase";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { ethereum, web3 } from "../utils/types";
import { FilterAddressToName, calsMarks } from "../utils";
import MemeABI from "../utils/abi/meme.json";
import { MemeAddress, PNFTAddress } from "../utils/source";
import { message } from "antd";
import ABIERC20 from "../utils/abi/erc20.json";

interface Send {
  from: string;
  gas: string;
  gasLimit: string;
}

const ethereumCoinbase = coinbaseWallet.makeWeb3Provider(
  DEFAULT_ETH_JSONRPC_URL,
  DEFAULT_CHAIN_ID
);

export const useHackthon = () => {
  const { state } = useContext(PNft);
  const { provider } = useSDK();
  const [contract, setContract] = useState<any>();
  const [contract20, setContract20] = useState<any>();
  const { walletProvider } = useWeb3ModalProvider();
  const Gas: string = FilterAddressToName(state.chain as string).gas;
  const [send, setSend] = useState<Send>({
    from: state.address || "",
    gas: state.chain === "10" ? "" : "0x2dc6c0",
    gasLimit: state.chain === "10" ? "" : "0x2dc6c0",
  });
  const initContract = async () => {
    const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const filterProvider = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const pi = filterProvider ? await filterProvider.eth.getGasPrice() : "0";
    const Contract = new web3.eth.Contract(MemeABI as any, MemeAddress, {
      gasPrice: pi,
    });
    const Contract20 = new web3.eth.Contract(ABIERC20 as any, PNFTAddress, {
      gasPrice: pi,
    });
    setContract(Contract);
    setContract20(Contract20);
  };
  useEffect(() => {
    initContract();
  }, []);
  const CreateHackthon = async (
    _name: string,
    _symbol: string,
    _total: number, //toWei
    _time: number,
    _contract: string,
    _funding: number, //toWei
    _fee: number, //toWei
    _vote: number //toWei
  ) => {
    const Price = await contract.methods.HACKTHON_CREATION_PRICE().call();
    // return;
    return new Promise((resolve, reject) => {
      contract.methods
        .createHackthon(
          _name,
          _symbol,
          _total,
          _time,
          _contract,
          web3.utils.toWei(String(_funding), "ether"),
          web3.utils.toWei(String(_fee), "ether"),
          web3.utils.toWei(String(_vote), "ether")
        )
        .send({
          from: send.from,
          gas: Gas,
          value: Price,
        })
        .on("receipt", (res: string) => {
          console.log(res);
          resolve(res);
        })
        .on("error", (err: any) => {
          console.log(err);
          resolve(err);
        });
    });
  };
  const QueryHackthonInfo = async () => {
    // hackthonIdCounter
    const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const filterProvider = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const pi = filterProvider ? await filterProvider.eth.getGasPrice() : "0";
    const Contract = new web3.eth.Contract(MemeABI as any, MemeAddress, {
      gasPrice: pi,
    });
    const result = await Contract.methods.hackthonIdCounter().call();
    const info = await Contract.methods.hackthons(result - 1).call();
    return info;
  };
  const QueryNFT = async () => {
    const result = await contract.methods._tokenIds().call();
    return result;
  };
  const QueryERC20Approve = async (
    _owner: string,
    _market_address: string
  ): Promise<string | number> => {
    const result = await contract20.methods
      .allowance(_owner, _market_address)
      .call();
    return result;
  };
  const ApproveToken = async (_approve_for_address: string) => {
    return new Promise((resolve, reject) => {
      contract20.methods
        .approve(
          calsMarks(_approve_for_address),
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        )
        .send(send)
        .on("receipt", (res: any) => {
          resolve(res);
        })
        .on("error", (err: any) => {
          resolve(err);
          message.warning(
            "You need to authorize the ERC20 token to continue the operation."
          );
        });
    });
  };
  const SubmitHackthon = async (
    _id: number,
    _image: string,
    _amount: number, //toWei
    _referrer: string
  ) => {
    console.log(
      _id,
      _image,
      web3.utils.toWei(String(_amount), "ether"),
      _referrer
    );
    return new Promise((resolve, reject) => {
      contract.methods
        .submit(
          _id,
          _image,
          web3.utils.toWei(String(_amount), "ether"),
          _referrer
        )
        .send({
          from: send.from,
          gas: Gas,
        })
        .on("receipt", (res: string) => {
          resolve(res);
          console.log(res);
        })
        .on("error", (err: any) => {
          console.log(err);
          resolve(err);
        });
    });
  };
  const VoteHackthon = async (
    _id: number,
    _nft_id: number,
    _amount: number, //toWei
    _referrer: string
  ) => {
    return new Promise((resolve, reject) => {
      contract.methods
        .vote(
          _id,
          _nft_id,
          web3.utils.toWei(String(_amount), "ether"),
          _referrer
        )
        .send({
          from: send.from,
          gas: Gas,
        })
        .on("receipt", (res: string) => {
          resolve(res);
          console.log(res);
        })
        .on("error", (err: any) => {
          console.log(err);
          resolve(err);
        });
    });
  };
  const CheckHackthon = async (_hackthon_id: number) => {
    const result = await contract.methods
      .checkClaimableAmount(_hackthon_id)
      .call();
    console.log(result);
    return result;
  };
  const ClaimHackthon = async (_id: number, _address: string) => {
    return new Promise((resolve, reject) => {
      contract.methods
        .claimTokens(_address)
        .send({
          from: send.from,
          gas: Gas,
        })
        .on("receipt", (res: string) => {
          resolve(res);
          console.log(res);
        })
        .on("error", (err: any) => {
          resolve(err);
          console.log(err);
        });
    });
  };
  return {
    CreateHackthon,
    QueryHackthonInfo,
    SubmitHackthon,
    VoteHackthon,
    CheckHackthon,
    ClaimHackthon,
    QueryERC20Approve,
    ApproveToken,
    QueryNFT,
  };
};
