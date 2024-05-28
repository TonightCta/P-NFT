import { ReactElement, useState } from "react";
import IconFont from "../../../utils/icon";
import { Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Item } from "..";

const HackthonCardNew = (props: {
  backModal: (token: number) => void;
  item: Item;
  online: boolean;
  address: string;
  chain_id:string;
  min: number;
}): ReactElement => {
  const navigate = useNavigate();
  const [item, setItem] = useState<Item>(props.item);
  return (
    <div
      className="hackthon-card-new"
      onClick={() => {
        navigate(`/hackthon/${item.hackthon_item_id}/${props.min}/${props.chain_id}`);
      }}
    >
      <div className="nft-box">
        {
          item.loading && <div className="load-box">
            <Spin size="large"/>
          </div>
        }
        <img src={item.url} alt="" onLoad={() => {
          setItem({
            ...item,
            loading:false
          })
        }}/>
      </div>
      <p className="name">#{item.hackthon_item_id}</p>
      <div className="owner-vote">
        <p>
          <IconFont type="icon-a-zu1439" className="gr-c" />
          {/* Owner */}
          <span>{item.creator.substring(0, 4)}...</span>
        </p>
        <p>
          <IconFont type="icon-a-zu1441" />
          <span>{item.votes}</span>
        </p>
      </div>
      <div className="vote-btn">
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            if (!props.address) {
              message.error("You need connect the wallet first");
              return;
            }
            if (!props.online) {
              message.error("The current hackathon has ended");
              return;
            }
            props.backModal(item.hackthon_item_id);
          }}
        >
          Vote
        </Button>
      </div>
    </div>
  );
};

export default HackthonCardNew;
