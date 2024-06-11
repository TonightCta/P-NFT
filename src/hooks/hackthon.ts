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
import { FilterAddressToName, FilterHackathonNet, calsMarks } from "../utils";
import MemeABI from "../utils/abi/meme.json";
import { MemeAddress, PNFTAddress, SystemAddress } from "../utils/source";
import { message } from "antd";
import ABIERC20 from "../utils/abi/erc20.json";

interface Send {
  from: string;
  gas: string;
  gasLimit: string;
}

export const HackathonSupport: string[] = ["8007736", "8453", "84532"];

const ethereumCoinbase = coinbaseWallet.makeWeb3Provider(
  DEFAULT_ETH_JSONRPC_URL,
  DEFAULT_CHAIN_ID
);

export const useHackathon = () => {
  const { state } = useContext(PNft);
  const { provider } = useSDK();
  const [contract, setContract] = useState<any>();
  // const [contract20, setContract20] = useState<any>();
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
    const chain = FilterHackathonNet(state.chain as string);
    const Contract = new web3.eth.Contract(MemeABI as any, chain.contract, {
        gasPrice: state.chain === '8007736' ? '' : pi,
    });
    // const Contract20 = new web3.eth.Contract(ABIERC20 as any,chain.token[0].contract, {
    //   gasPrice: pi,
    // });
    setContract(Contract);
    // setContract20(Contract20);
  };
  useEffect(() => {
    setSend({
      ...send,
      from: state.address as string,
    });
  }, [state.address]);
  useEffect(() => {
    if (HackathonSupport.indexOf(state.chain as string) < 0) {
      message.warning("Please switch to a supported network to use");
      return;
    }
    initContract();
  }, [state.chain]);
  const CreateHackathon = async (
    _name: string,
    _symbol: string,
    _total: number, //toWei
    _time: number,
    _contract: string,
    _fee: number, //toWei
    _vote: number //toWei
  ) => {
    // const Price = await contract.methods.HACKTHON_CREATION_PRICE().call();
    // return;
    return new Promise((resolve, reject) => {
      console.log(
        _name,
        _symbol,
        web3.utils.toWei(String(_total), "ether"),
        _time,
        _contract,
        web3.utils.toWei(String(_fee), "ether"),
        web3.utils.toWei(String(_vote), "ether")
      );
      contract.methods
        .createHackathon(
          _name,
          _symbol,
          web3.utils.toWei(String(_total), "ether"),
          _time,
          _contract,
          web3.utils.toWei(String(_fee), "ether"),
          web3.utils.toWei(String(_vote), "ether")
        )
        .send({
          from: send.from,
          gas: Gas,
          // value: Price,
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
  const QueryHackathonFee = async () => {
    const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const Contract = new web3.eth.Contract(MemeABI as any, FilterHackathonNet(state.chain as string).contract, {
      //   gasPrice: pi,
    });
    const result = await Contract.methods
      .supportedPayTokensFee(PNFTAddress)
      .call();
    return result;
  };
  const QueryHackathonInfo = async () => {
    // hackthonIdCounter
    const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    // const filterProvider = new Web3(
    //   (state.wallet === "metamask" && provider) ||
    //     (state.wallet === "coinbase" && ethereumCoinbase) ||
    //     (state.wallet === "walletconnect" && walletProvider) ||
    //     ethereum
    // );
    // const pi = filterProvider ? await filterProvider.eth.getGasPrice() : "0";
    const Contract = new web3.eth.Contract(MemeABI as any, MemeAddress, {
      //   gasPrice: pi,
    });
    const result = await Contract.methods.hackthonIdCounter().call();
    const info = await Contract.methods.hackthons(result - 1).call();
    return info;
  };
  const QueryNFT = async () => {
    const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const Contract = new web3.eth.Contract(MemeABI as any, MemeAddress, {
      //   gasPrice: pi,
    });
    const result = await Contract.methods._tokenIds().call();
    return result;
  };
  const QueryNFTInfo = async (_id: number) => {
    const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const Contract = new web3.eth.Contract(MemeABI as any, MemeAddress, {
      //   gasPrice: pi,
    });
    const info = await Contract.methods.tokenURI(_id).call();
    return info;
  };
  const QueryERC20Approve = async (
    _token_address:string,
    _owner: string,
    _for_address: string
  ): Promise<string | number> => {
     const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const Contract = new web3.eth.Contract(ABIERC20 as any, _token_address);
    const result = await Contract.methods
      .allowance(_owner, _for_address)
      .call();
    return result;
  };
  const ApproveToken = async (_token_address:string,_approve_for_address: string) => {
    const web3 = new Web3(
      (state.wallet === "metamask" && provider) ||
        (state.wallet === "coinbase" && ethereumCoinbase) ||
        (state.wallet === "walletconnect" && walletProvider) ||
        ethereum
    );
    const Contract = new web3.eth.Contract(ABIERC20 as any, _token_address);
    return new Promise((resolve, reject) => {
      Contract.methods
        .approve(
          calsMarks(_approve_for_address),
          "0xfffffffffffffffff"
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
  const SubmitHackathon = async (
    _id: number,
    _image: string,
    _amount: number, //toWei
    _referrer: string
  ) => {
    return new Promise((resolve, reject) => {
      contract.methods
        .submit(
          _id,
          _image,
          web3.utils.toWei(String(_amount), "ether"),
          _referrer ? _referrer : SystemAddress
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
  const VoteHackathon = async (
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
          _referrer ? _referrer : SystemAddress
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
  const CheckHackathon = async (
    _hackathon_id: number
  ) => {
    const result = await contract.methods
      .checkClaimableAmount(_hackathon_id)
      .call({from:send.from});
    return +web3.utils.fromWei(result)
  };
  const ClaimHackathon = async (_id: number) => {
    return new Promise((resolve, reject) => {
      contract.methods
        .claim(_id)
        .send({
          from: send.from,
          gas: Gas,
        })
        .on("transactionHash", (res: string) => {
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
    initContract,
    CreateHackathon,
    QueryHackathonInfo,
    SubmitHackathon,
    VoteHackathon,
    CheckHackathon,
    ClaimHackathon,
    QueryERC20Approve,
    ApproveToken,
    QueryNFT,
    QueryHackathonFee,
    QueryNFTInfo,
  };
};
