import { ReactElement, useContext, useEffect, useState } from "react";
import { Button, DatePicker, Modal, Select, Spin, message } from "antd";
import { useHackathon } from "../../../hooks/hackthon";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { PNFTAddress } from "../../../utils/source";
import { web3 } from "../../../utils/types";
import { useSwitchChain } from "../../../hooks/chain";
import { DateConvertMin, FilterHackathonNet, addCommasToNumber } from "../../../utils";
import { PNft } from "../../../App";
import { CurrencyList } from "../../../request/api";
import { useContract } from "../../../utils/contract";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";

interface Input {
  name: string;
  symbol: string;
  desc: string;
  total_supply: number | string;
  end_time: string | number;
  contract: string;
  fee: string | number;
  vote: string | number;
}

interface Token {
  name: string;
  label: string;
  logo: string;
  fee: string;
  value: string;
  hackathon_create_fee: number;
}

interface Net {
  chain_logo: string;
  value: string;
  label: string;
  token: Token[];
}
const Network: Net[] = [
  {
    label: "Plian Subchain 1",
    chain_logo: require("../../../assets/images/plian.logo.png"),
    value: "8007736",
    token: [],
  },
  {
    value: "8453",
    label: "Base LlamaNodes",
    chain_logo: require("../../../assets/images/base.logo.png"),
    token: [],
  },
  {
    value: "84532",
    label: "Base Sepolia Testnet",
    chain_logo: require("../../../assets/images/base.logo.png"),
    token: [],
  },
];

const LaunchModal = (props: {
  visible: boolean;
  address: string;
  onClose: (val: boolean) => void;
  openSuccess: (val: number) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [netService, setNetService] = useState<Net[]>(Network);
  const [input, setInput] = useState<Input>({
    name: "",
    symbol: "",
    desc: "",
    total_supply: 1000,
    end_time: +(Date.now() / 1000).toFixed(0) + 2626560,
    contract: PNFTAddress,
    fee: 1,
    vote: 1,
  });
  const [loading, setLoading] = useState<{ approve: boolean; submit: boolean }>(
    {
      approve: false,
      submit: false,
    }
  );
  const [disable, setDisable] = useState<{ approve: boolean; submit: boolean }>(
    {
      approve: true,
      submit: true,
    }
  );
  const [net, setNet] = useState<string>("8007736");
  const [token, setToken] = useState<Token[]>(Network[0].token);
  const { state } = useContext(PNft);
  const { switchC } = useSwitchChain();
  const [loadToken, setLoadToken] = useState<boolean>(false);
  const { balanceErc20 } = useContract();
  const [selectToken, setSelectToken] = useState<string>(
    Network[0].token[0]?.value
  );
  const { CreateHackathon, QueryERC20Approve, ApproveToken } = useHackathon();
  const queryTokenList = () => {
    const list: any = [];
    setLoadToken(true);
    Network.forEach((e: Net) => {
      list.push(
        CurrencyList({
          chain_id: e.value,
          is_support_hackathon: true,
          page_size: 30,
          page_num: 1,
        })
      );
    });
    Promise.all(list).then((res) => {
      const results = res.map((item: any) =>
        item.data.data.item
          ? item.data.data.item.map(
              (item: {
                currency_address: string;
                currency_name: string;
                logo_url: string;
              }) => {
                return {
                  ...item,
                  value: item.currency_address,
                  label: item.currency_name,
                  logo: item.logo_url,
                  fee: "0.01",
                };
              }
            )
          : []
      );
      Network.forEach((e: Net, index: number) => {
        e.token = results[index];
      });
      setLoadToken(false);
      setNetService(Network);
      setToken(results[0]);
      setSelectToken(results[0][0].value);
    });
  };
  const resetInp = () => {
    setInput({
      name: "",
      symbol: "",
      desc: "",
      total_supply: 1000,
      end_time: +(Date.now() / 1000).toFixed(0) + 2626560,
      contract: PNFTAddress,
      fee: 1,
      vote: 1,
    });
    setDisable({
      approve: true,
      submit: true,
    });
  };
  const submitLaunch = async () => {
    if (!input.name) {
      message.error("Please enter the name");
      return;
    }
    if (!input.symbol) {
      message.error("Please enter the symbol");
      return;
    }
    if (!input.total_supply) {
      message.error("Please enter the total supply");
      return;
    }
    if (+input.total_supply < 0) {
      message.error("Please enter correct the total supply");
      return;
    }
    if (!input.contract) {
      message.error("Please enter the contract address");
      return;
    }
    const chain: any = await switchC(+net);
    if (chain?.code) return;
    setLoading({
      ...loading,
      submit: true,
    });
    const balance = await balanceErc20(input.contract);
    if (+web3.utils.fromWei(balance) < 1) {
      message.error("Your balance is insufficient");
      return;
    }
    const result: any = await CreateHackathon(
      input.name,
      input.symbol,
      +input.total_supply * 1000000,
      +input.end_time,
      input.contract,
      +input.fee,
      +input.vote
    );
    setLoading({
      ...loading,
      submit: false,
    });
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success("Initiated successfully");
    resetInp();
    setVisible(false);
    props.onClose(false);
    props.openSuccess(
      +result.events["HackthonCreated"]?.returnValues?.hackthonId
    );
  };
  const queryToken = async () => {
    const query = await QueryERC20Approve(
      input.contract,
      props.address,
      FilterHackathonNet(state.chain as string).contract
    );
    const queryNum = +web3.utils.fromWei(String(query), "ether");
    
    if (queryNum < 1) {
      setDisable({
        submit:true,
        approve: false,
      });
    } else {
      setDisable({
        approve:true,
        submit: false,
      });
    }
  };

  const approveTokenInn = async () => {
    setLoading({
      ...loading,
      approve: true,
    });
    const approve: any = await ApproveToken(
      input.contract,
      FilterHackathonNet(state.chain as string).contract
    );
    setLoading({
      ...loading,
      approve: false,
    });
    if (!approve || approve.message) {
      message.error(approve.message);
      return;
    }
    queryToken();
  };
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
    !props.visible && resetInp();
    !!props.visible && queryTokenList();
    !!props.visible && queryToken();
  }, [props.visible]);
  useEffect(() => {
    if(!state.address) return
    setDisable({
      approve:true,
      submit:true
    });
    queryToken()
  },[input.contract])
  const selectChain = async (val: string) => {
    const chain: any = await switchC(+val);
    if (chain?.code) return;
    setNet(val);
    setToken(
      Network.filter((item: Net) => {
        return item.value === val;
      })[0].token
    );
    setSelectToken(
      Network.filter((item: Net) => {
        return item.value === val;
      })[0].token[0].value
    );
    setInput({
      ...input,
      contract: Network.filter((item: Net) => {
        return item.value === val;
      })[0].token[0].value,
    });
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setInput({
      ...input,
      end_time: Math.ceil((date as any).$d.getTime() / 1000),
    });
  };
  const selectTokenFN = (val: string) => {
    setInput({
      ...input,
      contract: val,
    });
    setSelectToken(val);
  };
  const afterMonth = () => {
    return DateConvertMin(+(Date.now() / 1000).toFixed(0) + 2626560);
  };
  return (
    <Modal
      title={<p className="center-modal-title">Launch Hackthon</p>}
      open={visible}
      footer={null}
      width={680}
      className="launch-modal-custom"
      onCancel={() => {
        setVisible(false);
        props.onClose(false);
      }}
    >
      <div className="launch-inner">
        <ul>
          <li>
            <p>
              <sup>*</sup>Name
            </p>
            <input
              type="text"
              placeholder="Please enter the name,eg.DogCoin"
              value={input.name}
              onChange={(e) => {
                setInput({
                  ...input,
                  name: e.target.value,
                });
              }}
            />
          </li>
          <li>
            <p>
              <sup>*</sup>Symbol
            </p>
            <input
              type="text"
              placeholder="Please enter the symbol,eg.DOGE"
              value={input.symbol}
              onChange={(e) => {
                setInput({
                  ...input,
                  symbol: e.target.value,
                });
              }}
            />
          </li>
          {/* <li>
            <p>
              <sup>*</sup>Description
            </p>
            <textarea
              placeholder="Please enter the description"
              value={input.desc}
              onChange={(e) => {
                setInput({
                  ...input,
                  desc: e.target.value,
                });
              }}
            ></textarea>
          </li> */}
          <li>
            <p>
              <sup>*</sup>Pay Token
            </p>
            {/* <input
              type="text"
              placeholder="Please enter the pay token contract"
              value={input.contract}
              onChange={(e) => {
                setInput({
                  ...input,
                  contract: e.target.value,
                });
              }}
            /> */}
            <div className="token-box">
              <div className="select-chain">
                <Select value={net} onChange={selectChain}>
                  {netService.map((item: Net, index: number) => {
                    return (
                      <Select.Option key={index} value={item.value}>
                        <div className="select-custom-option">
                          <img src={item.chain_logo} alt="" />
                          <p>{item.label}</p>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <div className="token-i">
                {loadToken && token.length < 1 && (
                  <div className="loading-b">
                    <Spin />
                  </div>
                )}
                <Select value={selectToken} onChange={selectTokenFN}>
                  {token.map((item: Token, index: number) => {
                    return (
                      <Select.Option key={index} value={item.value}>
                        <div className="select-custom-option">
                          <img src={item.logo} alt="" />
                          <p>{item.label}</p>
                          <p>
                            (Fees:<span>{item.hackathon_create_fee}</span>)
                          </p>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
                {/* <img src={token.logo} alt="" />
                <p>{token.symbol}</p>
                <p>
                  (Fees:<span>{(fee / 1e18).toFixed(4)}</span>)
                </p> */}
              </div>
            </div>
          </li>
          <li>
            <p>
              <sup>*</sup>Total Supply<span>({addCommasToNumber(+input.total_supply * 1e6)})</span>
            </p>
            <div className="with-oper">
              <div
                className="oper-btn"
                onClick={() => {
                  if (+input.total_supply <= 1000) return;
                  setInput({
                    ...input,
                    total_supply: +input.total_supply / 2,
                  });
                }}
              >
                <MinusOutlined />
              </div>
              <input
                type="number"
                placeholder="Please enter the total supply"
                value={input.total_supply}
                onChange={(e) => {
                  setInput({
                    ...input,
                    total_supply: e.target.value,
                  });
                }}
              />
              <span className="unit">(Unit: million)</span>
              <div
                className="oper-btn"
                onClick={() => {
                  setInput({
                    ...input,
                    total_supply: +input.total_supply * 2,
                  });
                }}
              >
                <PlusOutlined />
              </div>
            </div>
          </li>
          <li>
            <p>End Time</p>
            <DatePicker
              onChange={onChange}
              showTime={{ format: "HH:mm" }}
              format={"HH:mm DD/MM/YYYY"}
              defaultValue={dayjs(afterMonth(), "HH:mm DD/MM/YYYY")}
            />
          </li>
          {/* <li>
            <p>Min Funding Amount</p>
            <input
              type="number"
              placeholder="Please enter the amount"
              value={input.funding}
              onChange={(e) => {
                setInput({
                  ...input,
                  funding: e.target.value,
                });
              }}
            />
          </li>
          <li>
            <p>Min Submission Fee</p>
            <input
              type="number"
              placeholder="Please enter the fee"
              value={input.fee}
              onChange={(e) => {
                setInput({
                  ...input,
                  fee: e.target.value,
                });
              }}
            />
          </li>
          <li>
            <p>Min Voting Amount</p>
            <input
              type="number"
              placeholder="Please enter the amount"
              value={input.vote}
              onChange={(e) => {
                setInput({
                  ...input,
                  vote: e.target.value,
                });
              }}
            />
          </li> */}
        </ul>
        <div>
          <p className="submit">
            <Button
              type="primary"
              loading={loading.approve}
              className={`${disable.approve ? "dis-btn" : ""}`}
              disabled={loading.approve || disable.approve}
              onClick={approveTokenInn}
            >
              Approve
            </Button>
            <Button
              type="primary"
              loading={loading.submit}
              disabled={loading.submit || disable.submit}
              className={`${disable.submit ? "dis-btn" : ""}`}
              onClick={submitLaunch}
            >
              Submit
            </Button>
          </p>
          <p className={`line ${!disable.submit ? "c-line" : ""}`}>
            <span></span>
            <span></span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LaunchModal;
