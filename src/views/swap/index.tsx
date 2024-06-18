import { ReactElement, ReactNode, useEffect, useState } from "react";
import "./index.scss";
import { ethers } from "ethers";
import SwapCard from "./components/swap";
import KMapCard from "./components/k.map";
import { ethereum } from "../../utils/types";
import { CurrencyList } from "../../request/api";
import { Spin } from "antd";

export interface Token {
  chain_id: string;
  currency_address: string;
  currency_name: string;
  decimals: number;
  description: string;
  dex_pair_token_contract_address: string;
  dex_router_v2_contract_address: string;
  logo_url: string;
  total_supply: number;
  dex_pair_token_name:string
}

const SwapIndex = (): ReactElement<ReactNode> => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<Token>({
    chain_id: "",
    currency_address: "",
    currency_name: "",
    decimals: 0,
    description: "",
    dex_pair_token_contract_address: "",
    dex_router_v2_contract_address: "",
    logo_url: "",
    total_supply: 0,
    dex_pair_token_name:''
  });
  const getTokenList = async () => {
    setLoading(true);
    const result = await CurrencyList({
      is_support_swap: true,
      page_size: 30,
      page_num: 1,
    });
    const { data } = result;
    setLoading(false);
    setTokenList(data.data.item);
    setToken(data.data.item[0]);
  };
  useEffect(() => {
    getTokenList();
  }, []);
  return (
    <div className="swap-index">
      <div className="swap-inner">
        <div className="token-list-swap">
          <p className="list-name">New Memes Pool</p>

          <ul>
            {tokenList.map((item: Token, index: number) => {
              return (
                <li key={index} onClick={() => {
                  setToken(item);
                }}>
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
                </li>
              );
            })}
          </ul>
          {loading && (
            <div className="loading-box">
              <Spin size="large" />
            </div>
          )}
        </div>
        <div className="k-map">
          <KMapCard item={token}/>
        </div>
        <div className="swap">
          <SwapCard />
        </div>
      </div>
    </div>
  );
};

export default SwapIndex;
