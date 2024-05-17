import { Button, Modal, message } from "antd";
import { ReactElement, useEffect, useState } from "react";

interface Input{
    amount:string | number,
    address:string
}

const VoteModal = (props: {
  visible: boolean;
  onClose: (val: boolean) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [input,setInput] = useState<Input>({
    amount:'',
    address:''
  });
  const submitVote = async () => {
    if(!input.amount){
        message.error('Please enter the contribution amount');
        return
    }
    if(+input.amount){
        message.error('Please enter the correct contribution amount');
        return
    }
    if(!input.address){
        message.error('Please enter the referrer address');
        return
    }
  }
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
  }, [props.visible]);
  return (
    <Modal
      title="Vote"
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
                <p>Contribution Amount</p>
                <input type="number" placeholder="Please enter the contribution amount" value={input.amount} onChange={(e) => {
                    setInput({
                        ...input,
                        amount:e.target.value
                    })
                }}/>
            </li>
            <li>
                <p>Referrer</p>
                <input type="text" placeholder="Please enter the referrer address" value={input.address} onChange={(e) => {
                    setInput({
                        ...input,
                        address:e.target.value
                    })
                }}/>
            </li>
        </ul>
        <p className="submit">
            <Button type="primary" onClick={submitVote}>Vote</Button>
        </p>
      </div>
    </Modal>
  );
};

export default VoteModal;
