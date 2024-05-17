import { ReactElement, useEffect, useState } from "react";
import { Button, DatePicker, Modal, message } from "antd";
import type { DatePickerProps } from "antd";

interface Input {
  name: string;
  symbol: string;
  total_supply: number | string;
  end_time: string;
  contract: string;
  funding: string | number;
  fee: string | number;
  vote: string | number;
}

const LaunchModal = (props: { visible: boolean,onClose:(val:boolean) => void }): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [input, setInput] = useState<Input>({
    name: "",
    symbol: "",
    total_supply: "",
    end_time: "",
    contract: "",
    funding: "",
    fee: "",
    vote: "",
  });
  const [loading,setLoading] = useState<boolean>(false);
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
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
    if (!input.end_time) {
      message.error("Please select the end time");
      return;
    }
    if (!input.contract) {
      message.error("Please enter the contract address");
      return;
    }
    if (!input.funding) {
      message.error("Please enter the min funding amount");
      return;
    }
    if (+input.funding < 0) {
      message.error("Please enter the correct min funding amount");
      return;
    }
    if (!input.fee) {
      message.error("Please enter the min submission fee");
      return;
    }
    if (+input.fee) {
      message.error("Please enter the correct min submission fee");
      return;
    }
    if(!input.vote){
      message.error('Please enter the min voting amount');
      return
    }
    if(+input.vote < 0){
      message.error('Please enter the correct min voting amount');
      return
    }
  };
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
  }, [props.visible]);
  return (
    <Modal
      title="Launch hackthon"
      open={visible}
      footer={null}
      width={680}
      className="launch-modal-custom"
      onCancel={() => {
        setVisible(false);
        props.onClose(false)
      }}
    >
      <div className="launch-inner">
        <ul>
          <li>
            <p>Name</p>
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
            <p>Symbol</p>
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
            <p>Total Supply</p>
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
          </li>
          <li>
            <p>End Time</p>
            <DatePicker onChange={onChange} />
          </li>
          <li>
            <p>Pay Token Contract</p>
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
          </li>
        </ul>
        <p className="submit">
          <Button type="primary" loading={loading} disabled={loading} onClick={submitLaunch}>
            Submit
          </Button>
        </p>
      </div>
    </Modal>
  );
};

export default LaunchModal;
