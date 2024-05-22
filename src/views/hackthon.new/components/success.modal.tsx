import { Button, Modal } from "antd";
import { ReactElement, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";

interface Props {
  visible: boolean;
  type: number;
  address: string;
  onClose: (val: boolean) => void;
}

const SuccessModal = (props: Props): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
  }, []);
  return (
    <Modal
      title={null}
      open={visible}
      width={400}
      className="custom-success-modal"
      onCancel={() => {
        props.onClose(false);
        setVisible(false);
      }}
      footer={null}
    >
      <div className="success-inner">
        <img src={require("../../../assets/images/success.icon.png")} alt="" />
        <p className="submit">
          <Button
            type="primary"
            onClick={() => {
              const windowName = "newWindow";
              const windowFeatures = "width=800,height=600,top=100,left=100";
              const url_hackthon = `https://test.pizzap.io/#/hackthon-n?referrer=${
                props.address
              }&id=${1}`;
              const url_vote = `https://test.pizzap.io/#/hackthon/1?referrer=${
                props.address
              }&id=${1}`;
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  "Alex share"
                )}&url=${encodeURIComponent(
                  props.type === 1 ? url_hackthon : url_vote
                )}`,
                windowName,
                windowFeatures
              );
              props.onClose(false);
              setVisible(false);
            }}
          >
            Share&Earn
            <IconFont type="icon-arrow-up-right" />
          </Button>
        </p>
      </div>
    </Modal>
  );
};

export default SuccessModal;