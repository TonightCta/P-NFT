import { ReactElement, useState } from "react";
import { DateConvertS, addCommasToNumber } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { Col } from "..";
import { Spin } from "antd";

const CardLan = (props: Col): ReactElement => {
  const navigate = useNavigate();
  const [load, setLoad] = useState<boolean>(props.loading);
  return (
    <div
      className="card-lan"
      onClick={() => {
        navigate(
          `/launchpad/${props.collection_id}/${props.chain_id}/${props.contract_address}`
        );
      }}
    >
      <div className="poster-box">
        { load && <Spin size="large"/> }
        <img src={props.poster_url} alt="" onLoad={() => {
            setLoad(false);
        }}/>
      </div>
      <div className="msg-box">
        <p className="adv-remark">{props.collection_description}</p>
        <div className="total-msg">
          <div className="end-point">
            <div className="point-box">
              <div className="point-inner"></div>
            </div>
            <p>{DateConvertS(props.creat_time)}</p>
          </div>
          <p className="total-num">
            <img src={require("../../../assets/images/fire.gif")} alt="" />
            {addCommasToNumber(props.current_supply)}/
            {addCommasToNumber(props.total_supply)}
          </p>
        </div>
        <div className="progress-box">
          <div
            className="box-i"
            style={{
              width: `${(props.current_supply / props.total_supply) * 100}%`,
            }}
          ></div>
          <div
            className="p-num"
            style={{
              left: `${(props.current_supply / props.total_supply) * 100 - 2}%`,
            }}
          >
            <p>{(props.current_supply / props.total_supply) * 100}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLan;
