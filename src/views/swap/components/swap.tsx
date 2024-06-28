import { DownOutlined, SwapOutlined, WalletOutlined } from "@ant-design/icons";
import { ReactElement, useContext, useEffect, useState } from "react";
import type { Token } from "..";
import { Button, Popover, Spin, message } from "antd";
import IconFont from "../../../utils/icon";
import { CurrencyList } from "../../../request/api";
import { QueryPair, QueryPrice, SendTrade } from "../../../utils/swap";
import {
  QueryPairBaseTest,
  QueryPriceBaseTest,
  SendTradeBaseTest,
} from "../../../utils/swap.base.sepolia";
import {
  QueryPairBase,
  QueryPriceBase,
  SendTradeBase,
} from "../../../utils/swap.base";
import { ethers } from "ethers";
import { ethereum, web3 } from "../../../utils/types";
import { HackathonSupport, useHackathon } from "../../../hooks/hackthon";
import { PNft } from "../../../App";
import { useContract } from "../../../utils/contract";
import { FilterAddress } from "../../../utils";
import { useSwitchChain } from "../../../hooks/chain";
import ConnectModal from "../../../components/header.new/components/connect.modal";
import { toNormalNumber } from "../../memes";

type Amount = string | number;

const defaultToken: Token = {
  chain_id: "",
  currency_address: "",
  currency_name: "",
  decimals: 18,
  description: "",
  dex_pair_token_contract_address: "",
  dex_router_v2_contract_address: "",
  logo_url: "",
  total_supply: 0,
  dex_pair_token_name: "",
};

const SwapCard = (): ReactElement => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [tokenBList, setTokenBList] = useState<Token[]>([]);
  const [connect, setConnect] = useState<boolean>(false);
  const [ratio, setRatio] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(50);
  const [showSlip, setShowSlip] = useState<boolean>(false);
  const { state } = useContext(PNft);
  const { switchC } = useSwitchChain();
  const [price, setPrice] = useState<string>("0");
  const [amount, setAmount] = useState<{ in: Amount; out: Amount }>({
    in: "",
    out: "",
  });
  const { balanceErc20 } = useContract();
  const [balance, setBalance] = useState<{ token_a: number; token_b: number }>({
    token_a: 0,
    token_b: 0,
  });
  const [balance_a, setBalanceA] = useState<number>(0);
  const [balance_b, setBalanceB] = useState<number>(0);
  const [tokenA, setTokenA] = useState<Token>(defaultToken);
  const [tokenB, setTokenB] = useState<Token>(defaultToken);
  const [loading, setLoading] = useState<boolean>(false);
  const [wait, setWait] = useState<boolean>(false);
  const [type, setType] = useState<number>(1); // 1  --> Token A       2  --> Token B
  const [select, setSelect] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<number>(0);
  const { QueryERC20Approve, ApproveToken } = useHackathon();
  const getTokenList = async () => {
    setWait(true);
    const result = await CurrencyList({
      is_for_swap: true,
      chain_id: state.chain,
      page_size: 30,
      page_num: 1,
    });
    setWait(false);
    const { data } = result;
    if (!data.data.item) return;
    setTokenList(data.data.item);
    getTokenBList(data.data.item[0].currency_address);
  };
  const getTokenBList = async (_address: string) => {
    setWait(true);
    const result = await CurrencyList({
      is_for_swap: true,
      chain_id: state.chain,
      page_size: 30,
      page_num: 1,
      swap_tokenx_contract_address: _address,
    });
    setWait(false);
    const { data } = result;
    setTokenBList(data.data.item[0].dex_pair_infos);
  };
  const getRatio = async () => {
    const tokena = {
      chain_id: +tokenA.chain_id,
      address: tokenA.currency_address,
      decimals: tokenA.decimals,
      symbol: tokenA.currency_name,
    };
    const tokenb = {
      chain_id: +tokenB.chain_id,
      address: tokenB.currency_address,
      decimals: tokenB.decimals,
      symbol: tokenB.currency_name,
    };
    const eth = new ethers.providers.Web3Provider(ethereum);
    let result: string = "";
    switch (state.chain) {
      case "8007736":
        result = await QueryPair(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth
        );
        break;
      case "8453":
        result = await QueryPairBase(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth
        );
        break;
      case "84532":
        result = await QueryPairBaseTest(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth
        );
        break;
      default:
        result = await QueryPair(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth
        );
    }
    setRatio(+result);
    setAmount({
      ...amount,
      out: `≈ ${result}`,
    });
  };
  const disToken = (item: Token): boolean => {
    return (
      tokenA.currency_address === item.currency_address ||
      tokenB.currency_address === item.currency_address
    );
  };
  const turnSwap = async () => {
    if (!tokenA.currency_name) {
      message.error("Please select the token");
      return;
    }
    if (!tokenB.currency_name) {
      message.error("Please select the token");
      return;
    }
    if (!amount.in) {
      message.error("Please select the amount");
      return;
    }
    if (+amount.in < 0) {
      message.error("Please enter a valid amount");
      return;
    }
    if (+amount.in > balance_a) {
      message.error("Insufficient balance");
      return;
    }
    setLoading(true);
    const query = await QueryERC20Approve(
      tokenA.currency_address,
      state.address as string,
      tokenA.dex_router_v2_contract_address
    );
    const queryNum = +web3.utils.fromWei(String(query), "ether");
    if (queryNum < +amount.in) {
      const approve: any = await ApproveToken(
        tokenA.currency_address,
        tokenA.dex_router_v2_contract_address
      );
      if (!approve || approve.message) {
        message.error(approve.message);
        return;
      }
      turnSwap();
      return;
    }
    const tokena = {
      chain_id: +tokenA.chain_id,
      address: tokenA.currency_address,
      decimals: tokenA.decimals,
      symbol: tokenA.currency_name,
    };
    const tokenb = {
      chain_id: +tokenB.chain_id,
      address: tokenB.currency_address,
      decimals: tokenB.decimals,
      symbol: tokenB.currency_name,
    };

    const eth = new ethers.providers.Web3Provider(ethereum);
    const address = tokenA.dex_router_v2_contract_address;
    let result: any = "";
    switch (state.chain) {
      case "8007736":
        result = await SendTrade(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth,
          address
        );
        break;
      case "8453":
        result = await SendTradeBase(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth,
          address
        );
        break;
      case "84532":
        result = await SendTradeBaseTest(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth,
          address
        );
        break;
      default:
        result = await SendTrade(
          tokena,
          tokenb,
          toNormalNumber(+amount.in),
          slippage,
          eth,
          address
        );
    }
    setLoading(false);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success(
      "The exchange is successful, please pay attention to the wallet balance"
    );
    setTimestamp(new Date().getTime());
    setAmount({
      in: "",
      out: "",
    });
  };
  const getPrice = async () => {
    const tokena = {
      chain_id: +tokenA.chain_id,
      address: tokenA.currency_address,
      decimals: tokenA.decimals,
      symbol: tokenA.currency_name,
    };
    const tokenb = {
      chain_id: +tokenB.chain_id,
      address: tokenB.currency_address,
      decimals: tokenB.decimals,
      symbol: tokenB.currency_name,
    };
    const eth = new ethers.providers.Web3Provider(ethereum);
    let result: string = "";
    switch (state.chain) {
      case "8007736":
        result = await QueryPrice(tokena, tokenb, eth);
        break;
      case "8453":
        result = await QueryPriceBase(tokena, tokenb, eth);
        break;
      case "84532":
        result = await QueryPriceBaseTest(tokena, tokenb, eth);
        break;
      default:
        result = await QueryPrice(tokena, tokenb, eth);
    }
    setPrice(result);
  };
  useEffect(() => {
    if (
      tokenA.currency_address &&
      tokenB.currency_address &&
      amount.in &&
      +amount.in > 0
    ) {
      getRatio();
    }
    if (tokenA.currency_address && tokenB.currency_address) {
      getPrice();
    }
  }, [tokenA.currency_address, tokenB.currency_address, amount.in, slippage]);
  useEffect(() => {
    getTokenList();
  }, [state.chain]);
  const handleOpenChange = (newOpen: boolean) => {
    setShowSlip(newOpen);
  };
  const SlipList = () => {
    return (
      <ul className="slip-list">
        {[10, 30, 50].map((item: number, index: number) => {
          return (
            <li
              key={index}
              className={`${slippage === item ? "active-slip" : ""}`}
              onClick={() => {
                setShowSlip(false);
                setSlippage(item);
              }}
            >
              <p>{item / 10}&nbsp;%</p>
            </li>
          );
        })}
      </ul>
    );
  };
  const toFixedFloor = (value: number, decimals: number) => {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
  };
  const getBalance = async (_type: number, _address: string) => {
    if (!state.address) return;
    const chain: any = await switchC(+tokenA.chain_id);
    if (chain?.code) return;
    const result = await balanceErc20(_address, state.address);
    _type === 1
      ? setBalanceA(toFixedFloor(+Number(web3.utils.fromWei(result)), 6))
      : setBalanceB(toFixedFloor(+Number(web3.utils.fromWei(result)), 6));
  };
  useEffect(() => {
    const query = async () => {
      tokenA.currency_address && getBalance(1, tokenA.currency_address);
      tokenB.currency_address && getBalance(2, tokenB.currency_address);
    };
    query();
  }, [
    state.address,
    tokenA.currency_address,
    tokenB.currency_address,
    timestamp,
  ]);
  const addTokenTowWallet = async (item: Token) => {
    const win: any = window;
    try {
      await win.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: item.currency_address,
            symbol: item.currency_name,
            decimals: item.decimals,
            image: item.logo_url,
          },
        },
      });
    } catch (err: any) {
      message.error(err.message);
    }
  };
  return (
    <div className="swap-card">
      <div className="title-set">
        <p className="title">Meme Swap</p>
        <div className="right-s">
          <p className="tol">Slippage:</p>
          <Popover
            content={SlipList}
            title={null}
            placement="bottom"
            trigger="click"
            open={showSlip}
            onOpenChange={handleOpenChange}
          >
            <div className="set">
              <SwapOutlined />
              <p>{slippage / 10}&nbsp;%</p>
              {/* <Tooltip placement="bottom" title="Slippage">
              <QuestionCircleOutlined className="la"/>
            </Tooltip> */}
            </div>
          </Popover>
        </div>
      </div>
      <div className="token-a token-public">
        <p className="net">
          Network:
          <span>{FilterAddress(state.chain as string)?.chain_name}</span>
        </p>
        <div className="top-token">
          <div
            className="select"
            onClick={async () => {
              if (HackathonSupport.indexOf(state.chain as string) < 0) {
                const chain: any = await switchC(+HackathonSupport[0]);
                if (chain?.code) return;
              }
              setType(1);
              setSelect(true);
            }}
          >
            {!tokenA.currency_name ? (
              <p className="m-l">Select Token</p>
            ) : (
              <p className="token-msg">
                <img src={tokenA.logo_url} alt="" />
                <span>{tokenA.currency_name}</span>
              </p>
            )}
            <DownOutlined />
          </div>
          <input
            type="number"
            placeholder="0"
            value={amount.in}
            onChange={(e) => {
              setAmount({
                in: e.target.value,
                out: `≈ ${ratio}`,
              });
            }}
            onWheel={(event) => (event.target as HTMLElement).blur()}
          />
        </div>
        <p className="balance">
          <WalletOutlined />
          {balance_a.toFixed(6)}
          <span>{tokenA.currency_name}</span>
        </p>
      </div>
      <p
        className="arrow-box"
        onClick={() => {
          setTokenA({
            ...tokenB,
            dex_router_v2_contract_address:
              tokenA.dex_router_v2_contract_address,
          });
          setTokenB(tokenA);
          setAmount({
            in: ratio,
            out: "",
          });
          setBalance({
            token_a: balance.token_b,
            token_b: balance.token_a,
          });
          setBalanceA(balance_b);
          setBalanceB(balance_a);
        }}
      >
        <SwapOutlined />
      </p>
      <div className="token-b token-public">
        <div className="top-token">
          <div
            className="select"
            onClick={async () => {
              if (HackathonSupport.indexOf(state.chain as string) < 0) {
                const chain: any = await switchC(+HackathonSupport[0]);
                if (chain?.code) return;
              }
              setType(2);
              setSelect(true);
            }}
          >
            {!tokenB.currency_name ? (
              <p className="m-l">Select Token</p>
            ) : (
              <p className="token-msg">
                <img src={tokenB.logo_url} alt="" />
                <span>{tokenB.currency_name}</span>
              </p>
            )}
            <DownOutlined />
          </div>
          <input
            type="text"
            disabled={true}
            value={amount.out}
            onWheel={(event) => (event.target as HTMLElement).blur()}
          />
        </div>
        <p className="balance">
          <WalletOutlined />
          {balance_b.toFixed(6)}
          <span>{tokenB.currency_name}</span>
        </p>
      </div>
      {tokenA.currency_address && tokenB.currency_address && (
        <div className="price-text">
          <p>Rate</p>
          <p>
            1&nbsp;{tokenA.currency_name}&nbsp;≈&nbsp;{price}&nbsp;
            {tokenB.currency_name}
          </p>
        </div>
      )}
      <div className="submit">
        {state.address ? (
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={
              !tokenA.chain_id || state.chain === tokenA.chain_id
                ? turnSwap
                : () => {
                    switchC(+tokenA.chain_id);
                  }
            }
          >
            {`${
              !tokenA.chain_id || state.chain === tokenA.chain_id
                ? "Swap"
                : "Switch Network"
            }`}
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setConnect(true);
            }}
          >
            Connect Wallet
          </Button>
        )}
      </div>
      <div className={`select-token ${select ? "show-select" : ""}`}>
        <p
          className="title"
          onClick={() => {
            setSelect(false);
          }}
        >
          <IconFont type="icon-fanhuijiantou" />
          Select Token
        </p>
        <ul>
          {(type === 1 ? tokenList : tokenBList).map(
            (item: Token, index: number) => {
              return (
                <li
                  key={index}
                  onClick={async () => {
                    if (disToken(item)) return;
                    type === 1 ? setTokenA(item) : setTokenB(item);
                    setSelect(false);
                    type === 1 && getTokenBList(item.currency_address);
                  }}
                  className={`${disToken(item) ? "dis-token" : ""}`}
                >
                  <img src={item.logo_url} alt="" />
                  <div className="token-info">
                    <p>{item.currency_name}</p>
                    <p>
                      {item.currency_address.substring(0, 6)}...
                      {item.currency_address.substring(
                        item.currency_address.length - 6,
                        item.currency_address.length
                      )}
                    </p>
                  </div>
                  {type === 2 && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        addTokenTowWallet(item);
                      }}
                    >
                      Wallet
                    </Button>
                  )}
                </li>
              );
            }
          )}
        </ul>
        {wait && (
          <div className="loading-box">
            <Spin size="large" />
          </div>
        )}
        <ConnectModal
          visible={connect}
          close={(val: boolean) => {
            setConnect(val);
          }}
        />
      </div>
    </div>
  );
};

export default SwapCard;
