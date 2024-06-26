import { ReactElement, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Item } from "..";

const HackthonCardNew = (props: {
  backModal: (token: number) => void;
  item: Item;
  online: boolean;
  address: string;
  chain_id: string;
  min: number;
}): ReactElement => {
  const navigate = useNavigate();
  const [item, setItem] = useState<Item>(props.item);
  useEffect(() => {
    setItem(props.item);
  }, [props.item.url]);
  return (
    <div
      className="hackthon-card-new"
      onClick={() => {
        navigate(
          `/hackthon/${item.hackthon_item_id}/${props.min}/${props.chain_id}`
        );
      }}
    >
      <div className="first-icon">
        <img src={require('../../../assets/images/dog.fot.png')} alt="" />
        <p>Best</p>
      </div>
      <div className="mobile-use">
        <div className="nft-box">
          <p className="name">#{item.hackthon_item_id}</p>
          {item.loading && (
            <div className="load-box">
              <Spin />
            </div>
          )}
          <img
            src={item.url}
            alt=""
            onLoad={() => {
              setItem({
                ...item,
                loading: false,
              });
            }}
          />
        </div>
        <div className="right-msg">
          <div className="owner-vote">
            <p>
              <IconFont type="icon-a-zu1439" className="gr-c" />
              <span>Owner</span>
              <span>{item.creator.substring(0, 6)}...</span>
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
              <IconFont type="icon-a-lujing555"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackthonCardNew;
