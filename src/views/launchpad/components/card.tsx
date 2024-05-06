import { ReactElement } from "react";
import { DateConvertS, addCommasToNumber } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { Col } from "..";

const CardLan = (props:Col): ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="card-lan" onClick={() => {
        navigate(`/launchpad/${props.collection_id}`)
    }}>
      <div className="poster-box">
        <img src={props.poster_url} alt="" />
      </div>
      <div className="msg-box">
        <p className="adv-remark">
          {props.collection_description}
        </p>
        <div className="total-msg">
          <div className="end-point">
            <div className="point-box">
              <div className="point-inner"></div>
            </div>
            <p>{DateConvertS(props.creat_time)}</p>
          </div>
          <p className="total-num">{addCommasToNumber(props.current_supply)}/{addCommasToNumber(props.total_supply)}</p>
        </div>
        <div className="progress-box">
            
        </div>
      </div>
    </div>
  );
};

export default CardLan;
