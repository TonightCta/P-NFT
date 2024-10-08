import { Button } from "antd";
import { ReactElement, useState } from "react";

const HackthonCardD = (props:{backModal:(id:number) => void}): ReactElement => {
  return (
    <div className="hackthon-card-detail">
      <div>
        <div className="poster-box">
          <img src={require("../../../assets/images/test2.png")} alt="" />
        </div>
        <p className="name">Unknow</p>
        <div className="oper-box">
          <p>Unknow</p>
          <Button type="primary" onClick={() => {
            props.backModal(1)
          }}>Vote</Button>
        </div>
      </div>
    </div>
  );
};

export default HackthonCardD;
