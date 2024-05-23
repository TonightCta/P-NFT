import { ReactElement, useEffect, useState } from "react";
import { Button, DatePicker, Modal, message } from "antd";
import type { DatePickerProps } from "antd";
import { useHackathon } from "../../../hooks/hackthon";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

interface Input {
  name: string;
  symbol: string;
  desc: string;
  total_supply: number | string;
  end_time: string | number;
  contract: string;
  funding: string | number;
  fee: string | number;
  vote: string | number;
}

const LaunchModal = (props: {
  visible: boolean;
  onClose: (val: boolean) => void;
  openSuccess: (val: number) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [input, setInput] = useState<Input>({
    name: "",
    symbol: "",
    desc: "",
    total_supply: 1000,
    end_time: "",
    contract: "0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08",
    funding: "",
    fee: "",
    vote: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { CreateHackathon } = useHackathon();
  const resetInp = () => {
    setInput({
      name: "",
      symbol: "",
      desc: "",
      total_supply: 1000,
      end_time: "",
      contract: "0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08",
      funding: "",
      fee: "",
      vote: "",
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
    const result: any = await CreateHackathon(
      input.name,
      input.symbol,
      +input.total_supply,
      +input.end_time,
      input.contract,
      +input.funding,
      +input.fee,
      +input.vote
    );
    setLoading(false);
    console.log(result);
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
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
  }, [props.visible]);
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
              placeholder="Please enter the name"
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
              placeholder="Please enter the symbol"
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
            <input
              type="text"
              placeholder="Please enter the pay token contract"
              value={input.contract}
              onChange={(e) => {
                setInput({
                  ...input,
                  contract: e.target.value,
                });
              }}
            />
          </li>
          <li>
            <p>
              <sup>*</sup>Total Supply<span>(Unit: thousand)</span>
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
