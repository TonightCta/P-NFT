import { ReactElement, ReactNode, useState } from "react";
import "./index.scss";
import { Button } from "antd";
import HackthonCardD from "./components/card";
import SubmitWorkModal from "./components/submit.work.modal";
import VoteModal from "./components/vote.modal";

const HackthonDetailView = (): ReactElement<ReactNode> => {
  const [workModal, setWorkModal] = useState<boolean>(false);
  const [voteModal, setVoteModal] = useState<boolean>(false);
  return (
    <div className="hackthon-detail-view">
      <div className="bg-box">
        <img src={require("../../assets/new/contest_bg.png")} alt="" />
      </div>
      <div className="hackthon-msg-card">
        <div className="poster-box">
          <img src={require("../../assets/images/drop_bg.png")} alt="" />
        </div>
        <div className="info-box">
          <p className="name">Hackthon Name</p>
          <p className="remark">Hackthon remark...</p>
          <div className="date-oper">
            <p className="date-text">
              24/04/2024<span>-</span>31/05/2024
            </p>
            <div className="oper-box">
              <Button type="primary" onClick={() => {
                setWorkModal(true)
              }}>Submit Your Work</Button>
              <p>(Dev:Shown when not attending)</p>
              <Button type="primary">Check / Claim</Button>
              <p>(Dev:Shown when participating)</p>
            </div>
          </div>
        </div>
      </div>
      <div className="tabs-oper">
        <p>Arts Works</p>
      </div>
      <div className="item-list">
        {[1, 2, 3, 4, 5].map((item: number, index: number) => {
          return <HackthonCardD key={index} backModal={(val:number) => {
            setVoteModal(true)
          }}/>;
        })}
      </div>
      <SubmitWorkModal visible={workModal} onClose={(val:boolean) => {
        setWorkModal(val);
      }} />
      <VoteModal
        visible={voteModal}
        onClose={(val: boolean) => {
          setVoteModal(val);
        }}
      />
    </div>
  );
};

export default HackthonDetailView;
