import {
  Token,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
  Percent,
} from "@alex_7/sdk-swap-base";
import { ethers } from "ethers";
import UniswapV2SwapABI from "./abi/swap-v2.json";
import { ethereum, web3 } from "./types";
import Web3 from "web3";

export interface TokenParams {
  chain_id: number;
  address: string;
  decimals: number;
  symbol: string;
}

const getToken = (_token: TokenParams) => {
  return new Token(
    _token.chain_id,
    _token.address,
    _token.decimals,
    _token.symbol
  );
};
export const QueryPriceBaseTest = async (
  _token_a: TokenParams,
  _token_b: TokenParams,
  _provider: any
) => {
  const TokenA = getToken(_token_a);
  const TokenB = getToken(_token_b);
  const pair = await Fetcher.fetchPairData(TokenA, TokenB, _provider);
  const route = new Route([pair], TokenA);
  return route.midPrice.toSignificant(6);
};
export const QueryPairBaseTest = async (
  _token_a: TokenParams,
  _token_b: TokenParams,
  _amount: string,
  _slippage_tolerance: number,
  _provider: any
) => {
  const TokenA = getToken(_token_a);
  const TokenB = getToken(_token_b);
  const pair = await Fetcher.fetchPairData(TokenA, TokenB, _provider);
  const route = new Route([pair], TokenA);
  const amountIn = ethers.utils.parseUnits(_amount.toString(), TokenA.decimals);
  const trade = new Trade(
    route,
    new TokenAmount(TokenA, amountIn.toString()),
    TradeType.EXACT_INPUT
  );
  const slippageTolerancePercent = new Percent(
    _slippage_tolerance.toString(),
    "10000"
  ); // 0.5% slippage tolerance
  const amountOutMin = trade.minimumAmountOut(slippageTolerancePercent).raw;
  return Number(web3.utils.fromWei(amountOutMin.toString())).toFixed(6);
};

export const SendTradeBaseTest = async (
  _token_a: TokenParams,
  _token_b: TokenParams,
  _amount: string,
  _slippage_tolerance: number,
  _provider: any,
  _router_address: string
) => {
  const TokenA = getToken(_token_a);
  const TokenB = getToken(_token_b);
  const pair = await Fetcher.fetchPairData(TokenA, TokenB, _provider);
  const route = new Route([pair], TokenA);
  const amountIn = ethers.utils.parseUnits(_amount.toString(), TokenA.decimals);
  const signer = _provider.getSigner();
  const trade = new Trade(
    route,
    new TokenAmount(TokenA, amountIn.toString()),
    TradeType.EXACT_INPUT
  );
  const slippageTolerancePercent = new Percent(
    _slippage_tolerance.toString(),
    "10000"
  ); // 0.5% slippage tolerance
  const amountOutMin = trade.minimumAmountOut(slippageTolerancePercent).raw; // Minimum amount of DAI received
  const reserves = pair.reserveOf(TokenB);
  if (
    +web3.utils.fromWei(amountOutMin.toString()) >
    +reserves.toSignificant(6) / 2
  ) {
    return {
      message: "Trade amount exceeds available liquidity",
    };
  }
  const path = [TokenA.address, TokenB.address];
  const to = await signer.getAddress(); // The receiving address
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const web3Sec = new Web3(ethereum);
  const gas = await web3Sec.eth.getGasPrice();
  const web3Contract = new web3Sec.eth.Contract(
    UniswapV2SwapABI as any,
    _router_address,
    {
      gasPrice: gas,
    }
  );
  return new Promise((resolve, reject) => {
    web3Contract.methods
      .swapExactTokensForTokens(
        amountIn.toString(),
        amountOutMin.toString(),
        path,
        to,
        deadline
      )
      .send({ from: to, gas: "4200000" })
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
