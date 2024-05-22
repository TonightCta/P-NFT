import { Button, Modal, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { MemeAddress, SystemAddress } from "../../../utils/source";
import { useHackthon } from "../../../hooks/hackthon";
import { web3 } from "../../../utils/types";
import { PNft } from "../../../App";

interface Input {
  amount: string | number;
  address: string;
}

const VoteModal = (props: {
  visible: boolean;
  id: number;
  onClose: (val: boolean) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { QueryERC20Approve, ApproveToken, VoteHackthon, QueryNFT } =
    useHackthon();
  const { state } = useContext(PNft);
  const [input, setInput] = useState<Input>({
    amount: "",
    address: SystemAddress,
  });
  const submitVote = async () => {
    if (!input.amount) {
      message.error("Please enter the contribution amount");
      return;
    }
    if (+input.amount < 0) {
      message.error("Please enter the correct contribution amount");
      return;
    }
    if (!input.address) {
      message.error("Please enter the referrer address");
      return;
    }
    setLoading(true);
    const query = await QueryERC20Approve(state.address as string, MemeAddress);
    const queryNum = +web3.utils.fromWei(String(query), "ether");
    if (queryNum < 1) {
      const approve: any = await ApproveToken(MemeAddress);
      if (!approve || approve.message) {
        setLoading(false);
        return;
      }
      submitVote();
      return;
    }
    const id = await QueryNFT();
    const result:any = await VoteHackthon(
      props.id,
      +id - 1,
      +input.amount,
      input.address
    );
    setLoading(false);
    console.log(result);
    if(!result || result.message){
      message.error(result.message);
      return
    };
    message.success('Vote Successful');
    setInput({
      amount:'',
      address:SystemAddress
    });
    setVisible(false);
    props.onClose(false);
  };
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
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
            <p><sup>*</sup>Contribution Amount</p>
            <input
              type="number"
              placeholder="Please enter the contribution amount"
              value={input.amount}
              onChange={(e) => {
                setInput({
                  ...input,
                  amount: e.target.value,
                });
              }}
            />
          </li>
          <li>
            <p><sup>*</sup>Referrer</p>
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
            loading={loading}
            disabled={loading}
            onClick={submitVote}
          >
            Vote
          </Button>
        </p>
      </div>
    </Modal>
  );
};

export default VoteModal;
