import { Modal } from "antd";
import { ReactElement, useState } from "react";

interface Props{
    visible:boolean,
    name:string,
    amount:number,
    onClose:(val:boolean) => void
}

const RewardModal = (props:Props): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <Modal
      title={null}
      open={visible}
      footer={null}
      onCancel={() => {
        setVisible(false);
        props.onClose(false);
      }}
    >
      <div className="custom-modal-check">
        <div className="icon-box">
            <img src={require('../../../../assets/images/at.pink.png')} alt="" />
        </div>
        <p className="name">
            {props.name}
        </p>
        <p className="amount">
            The current avallable balance is <span>{props.amount}</span>
        </p>
      </div>
    </Modal>
  );
};

export default RewardModal;
