import { Button, Modal, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useHackathon } from "../../../hooks/hackthon";
import { web3 } from "../../../utils/types";
import { PNft } from "../../../App";
import { GetUrlKey } from "../../../utils";
import { useSwitchChain } from "../../../hooks/chain";
import { useContract } from "../../../utils/contract";

interface Input {
  amount: string | number;
  address: string;
}

const VoteModal = (props: {
  visible: boolean;
  hackathon_id: number;
  min: number;
  token_id: number;
  chain_id: string;
  pay_token_address: string;
  create_address: string;
  pay_token_symbol: string;
  pay_token_url: string;
  onClose: (val: boolean) => void;
  onSuccess: (hackathon_id: number) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
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
  const { QueryERC20Approve, ApproveToken, VoteHackathon } = useHackathon();
  const { switchC } = useSwitchChain();
  const { state } = useContext(PNft);
  const { balanceErc20 } = useContract();
  const [input, setInput] = useState<Input>({
    amount: props.min ? props.min : "",
    address: GetUrlKey("referrer", window.location.href) || "",
  });
  const queryToken = async () => {
    const query = await QueryERC20Approve(
      props.pay_token_address,
      state.address as string,
      props.create_address
    );
    const queryNum = +web3.utils.fromWei(String(query), "ether");
    if (queryNum < 1) {
      setDisable({
        ...disable,
        approve: false,
      });
    } else {
      setDisable({
        ...disable,
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
      props.pay_token_address,
      props.create_address
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
    props.min &&
      setInput({
        ...input,
        amount: props.min,
      });
  }, [props.min]);
  const submitVote = async () => {
    if (!input.amount) {
      message.error("Please enter the contribution amount");
      return;
    }
    if (+input.amount < 0) {
      message.error("Please enter the correct contribution amount");
      return;
    }
    if (+input.amount < props.min) {
      message.error(`The minimum number of votes is ${props.min}`);
      return;
    }
    if (input.address && input.address.length !== 42) {
      message.error("Please enter the correct wallet address");
      return;
    }
    if (input.address && input.address.substring(0, 2) !== "0x") {
      message.error("Please enter the correct wallet address");
      return;
    }
    if (input.address === state.address) {
      message.error("The same wallet address cannot be recommended");
      return;
    }
    const chain: any = await switchC(+props.chain_id);
    if (chain?.code) return;
    setLoading({
      ...loading,
      submit: true,
    });
    const balance = await balanceErc20(props.pay_token_address);
    if (+web3.utils.fromWei(balance) < +input.amount) {
      message.error("Your balance is insufficient");
      return;
    }
    const result: any = await VoteHackathon(
      props.hackathon_id,
      props.token_id,
      +input.amount,
      input.address
    );
    setLoading({
      ...loading,
      submit: false,
    });
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success("Vote Successful");
    setDisable({
      approve: true,
      submit: true,
    });
    setVisible(false);
    props.onClose(false);
    props.onSuccess(props.hackathon_id);
  };
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
    !!props.visible && queryToken();
    const clear = () => {
      setInput({
        amount: props.min ? props.min : "",
        address: GetUrlKey("referrer", window.location.href) || "",
      });
      setDisable({
        approve: true,
        submit: true,
      });
    };
    !props.visible && clear();
  }, [props.visible]);
  return (
    <Modal
      title={<p className="center-modal-title">Vote</p>}
      className="vote-modal-custom"
      open={visible}
      footer={null}
      onCancel={() => {
        setVisible(false);
        props.onClose(false);
      }}
    >
      <div className="vote-inner">
        <ul>
          <li>
            <p>
              <sup>*</sup>Contribution Amount
              <span>(1{props.pay_token_symbol} equals one vote)</span>
            </p>
            <input
              type="number"
              placeholder={`Please enter the contribution amount(min:${props.min})`}
              value={input.amount}
              onChange={(e) => {
                setInput({
                  ...input,
                  amount: e.target.value,
                });
              }}
            />
            <div className="token-box">
              <img src={props.pay_token_url} alt="" />
              <p>{props.pay_token_symbol}</p>
            </div>
          </li>
          <li>
            <p>Referrer</p>
            <input
              type="text"
              placeholder="Please enter the referrer address"
              value={input.address}
              onChange={(e) => {
                setInput({
                  ...input,
                  address: e.target.value,
                });
              }}
            />
          </li>
        </ul>
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
            onClick={submitVote}
          >
            Vote
          </Button>
        </p>
        <p className={`line ${!disable.submit ? "c-line" : ""}`}>
          <span></span>
          <span></span>
        </p>
      </div>
    </Modal>
  );
};

export default VoteModal;
