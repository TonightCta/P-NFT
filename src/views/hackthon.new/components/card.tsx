import { ReactElement } from "react";
import IconFont from "../../../utils/icon";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const HackthonCardNew = (props:{backModal:(val:number) => void}): ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="hackthon-card-new" onClick={() => {
        navigate(`/hackthon/${1}`)
    }}>
      <div className="nft-box">
        <img src={require("../../../assets/images/test2.png")} alt="" />
      </div>
      <p className="name">NFT Bus pandaXXXXX #0098</p>
      <div className="owner-vote">
        <p>
          <IconFont type="icon-a-zu1439" className="gr-c"/>
          Owner
          <span>1006fb</span>
        </p>
        <p>
          <IconFont type="icon-a-zu1441" />
          <span>20,000</span>
        </p>
      </div>
      <div className="vote-btn">
        <Button type="primary" onClick={(e) => {
            e.stopPropagation();
            props.backModal(1)

        }}>Vote</Button>
      </div>
    </div>
  );
};

export default HackthonCardNew;
