import { ReactElement } from "react";
import IconFont from "../../../utils/icon";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const HackthonCardNew = (props: {
  backModal: (val: number) => void;
  item: number | string;
  address: string;
}): ReactElement => {
  const navigate = useNavigate();
  return (
    <div
      className="hackthon-card-new"
      onClick={() => {
        navigate(`/hackthon/${1}`);
      }}
    >
      <div className="nft-box">
        <img
          src={
            typeof props.item === "string"
              ? props.item
              : require("../../../assets/images/test2.png")
          }
          alt=""
        />
      </div>
      <p className="name">NFT Name</p>
      <div className="owner-vote">
        <p>
          <IconFont type="icon-a-zu1439" className="gr-c" />
          {/* Owner */}
          <span>1006fb</span>
        </p>
        <p>
          <IconFont type="icon-a-zu1441" />
          <span>20,000</span>
        </p>
      </div>
      <div className="vote-btn">
        <Button
          type="primary"
          onClick={(e) => {
            //TODO
            //switch network
            if (!props.address) {
              message.error("You need connect the wallet first");
              return;
            }
            e.stopPropagation();
            props.backModal(1);
          }}
        >
          Vote
        </Button>
      </div>
    </div>
  );
};

export default HackthonCardNew;
