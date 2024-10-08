import { ReactElement, useEffect, useState } from "react";
import { DateConvertS, addCommasToNumber } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { Col } from "..";

const CardLan = (props: Col): ReactElement => {
  const navigate = useNavigate();
  const [info, setInfo] = useState<any>();
  return (
    <div
      className="card-lan"
      onClick={() => {
        navigate(`/hackthon/1`);
      }}
    >
      <div className="poster-box">
        {/* { !load && <Spin size="large"/> } */}
        {/* {!load && <div className="load-box">
          <Spin size="large"/>
        </div>} */}
        {/* <img src={require("../../../assets/images/drop_bg.png")} alt="" /> */}
      </div>
      <div className="msg-box">
        <p className="adv-remark">{info?.name}({info?.symbol})</p>
        <div className="total-msg">
          <div className="end-point">
            <div className="point-box">
              <div className="point-inner"></div>
            </div>
            <p>{DateConvertS(+info?.endTime)}</p>
          </div>
          <p className="total-num">
            <img src={require("../../../assets/images/fire.gif")} alt="" />
            {addCommasToNumber(+info?.totalSupply)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardLan;
