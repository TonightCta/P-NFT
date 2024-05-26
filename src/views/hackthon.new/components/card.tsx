import { ReactElement } from "react";
import IconFont from "../../../utils/icon";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const HackthonCardNew = (props: {
  backModal: (token:number) => void;
  item: any;
  address: string;
}): ReactElement => {
  const navigate = useNavigate();
  return (
    <div
      className="hackthon-card-new"
      onClick={() => {
        navigate(`/hackthon/${props.item.token_id}`);
      }}
    >
      <div className="nft-box">
        <img
          src={props.item.url}
          alt=""
        />
      </div>
      <p className="name">NFT Name&nbsp;#{props.item.token_id}</p>
      <div className="owner-vote">
        <p>
          <IconFont type="icon-a-zu1439" className="gr-c" />
          {/* Owner */}
          <span>{props.item.creator.substring(0,4)}...</span>
        </p>
        <p>
          <IconFont type="icon-a-zu1441" />
          <span>{props.item.votes}</span>
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
            props.backModal(props.item.token_id);
          }}
        >
          Vote
        </Button>
      </div>
    </div>
  );
};

export default HackthonCardNew;
