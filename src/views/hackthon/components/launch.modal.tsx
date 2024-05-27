import { ReactElement, useContext, useEffect, useState } from "react";
import { Button, DatePicker, Modal, Select, message } from "antd";
import type { DatePickerProps } from "antd";
import { useHackathon } from "../../../hooks/hackthon";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { MemeAddress, PNFTAddress } from "../../../utils/source";
import { web3 } from "../../../utils/types";

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
    token: [
      {
        name: "PNFT",
        label: "PNFT",
        logo: require("../../../assets/images/pnft.png"),
        value: PNFTAddress,
        fee: "0.01",
      },
    ],
  },
  {
    value: "8453",
    label: "Base LlamaNodes",
    chain_logo: require("../../../assets/images/base.logo.png"),
    token: [
      {
        name: "TRUMP",
        label: "TRUMP",
        logo: require("../../../assets/images/test2.png"),
        value: "123",
        fee: "1",
      },
    ],
  },
];

const LaunchModal = (props: {
  visible: boolean;
  address: string;
  onClose: (val: boolean) => void;
  openSuccess: (val: number) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [fee, setFee] = useState<number>(0);
  const [input, setInput] = useState<Input>({
    name: "",
    symbol: "",
    desc: "",
    total_supply: 1000,
    end_time: +(Date.now() / 1000).toFixed(0) + 2626560,
    contract: "0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08",
    fee: 1,
    vote: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [net, setNet] = useState<string>("8007736");
  const [token, setToken] = useState<Token[]>(Network[0].token);
  const [selectToken, setSelectToken] = useState<string>(
    Network[0].token[0].value
  );
  const {
    CreateHackathon,
    QueryERC20Approve,
    ApproveToken,
    QuertHackathonFee,
  } = useHackathon();
  const resetInp = () => {
    setInput({
      name: "",
      symbol: "",
      desc: "",
      total_supply: 1000,
      end_time: +(Date.now() / 1000).toFixed(0) + 2626560,
      contract: "0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08",
      fee: 1,
      vote: 1,
    });
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setInput({
      ...input,
      end_time: new Date(dateString).getTime() / 1000,
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
    setLoading(true);
    const query = await QueryERC20Approve(props.address, MemeAddress);
    const queryNum = +web3.utils.fromWei(String(query), "ether");
    if (queryNum < 1) {
      const approve: any = await ApproveToken(MemeAddress);
      if (!approve || approve.message) {
        setLoading(false);
        return;
      }
      submitLaunch();
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
    setLoading(false);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success("Initiated successfully");
    resetInp();
    setVisible(false);
    props.onClose(false);
    //TODO
    props.openSuccess(1);
  };
  const quertFees = async () => {
    const result = await QuertHackathonFee();
    console.log(result);
    setFee(result);
  };
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
    !!props.visible && quertFees();
    !props.visible && resetInp();
  }, [props.visible]);
  const selectChain = (val: string) => {
    setNet(val);
    setToken(
      Network.filter((item: Net) => {
        return item.value === val;
      })[0].token
    );
    console.log(Network.filter((item: Net) => {
        return item.value === val;
      })[0].token[0].value)
    setSelectToken(
      Network.filter((item: Net) => {
        return item.value === val;
      })[0].token[0].value
    );
  };
  const selectTokenFN = (val: string) => {
    setSelectToken(val);
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
          <li>
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
          </li>
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
                  {Network.map((item: Net, index: number) => {
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
                <Select value={selectToken} onChange={selectTokenFN}>
                  {token.map((item: Token, index: number) => {
                    return (
                      <Select.Option key={index} value={item.value}>
                        <div className="select-custom-option">
                          <img src={item.logo} alt="" />
                          <p>{item.label}</p>
                          <p>(Fees:<span>{item.fee}</span>)</p>
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
              <sup>*</sup>Total Supply<span>(Unit: million)</span>
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
          {/* <li>
            <p>End Time</p>
            <DatePicker onChange={onChange} />
          </li>
           <li>
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
        <p className="submit">
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={submitLaunch}
          >
            Submit
          </Button>
        </p>
      </div>
    </Modal>
  );
};

export default LaunchModal;
