import { ReactElement, ReactNode, useEffect, useState } from "react";
import "./index.scss";
import { Button } from "antd";
import HackthonCardD from "./components/card";
import { DateConvertS } from "../../utils";

const HackthonDetailView = (): ReactElement<ReactNode> => {
  const [workModal, setWorkModal] = useState<boolean>(false);
  const [voteModal, setVoteModal] = useState<boolean>(false);
  const [info, setInfo] = useState<any>();
  return (
    <div className="hackthon-detail-view">
      <div className="bg-box">
        <img src={require("../../assets/new/contest_bg.png")} alt="" />
      </div>
      <div className="hackthon-msg-card">
        <div className="poster-box">
          {/* <img src={require("../../assets/images/drop_bg.png")} alt="" /> */}
        </div>
        <div className="info-box">
          <p className="name">{info?.name}</p>
          <p className="remark">{info?.symbol}...</p>
          <div className="date-oper">
            <p className="date-text">
              {DateConvertS(Date.now() / 1000)}
              <span>-</span>
              {DateConvertS(+info?.endTime)}
            </p>
            <div className="oper-box">
              <Button
                type="primary"
                onClick={() => {
                  setWorkModal(true);
                }}
              >
                Submit Your Work
              </Button>
              <p>(Dev:Shown when not attending)</p>
              <Button type="primary" onClick={() => {}}>
                Check / Claim
              </Button>
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
          return (
            <HackthonCardD
              key={index}
              backModal={(val: number) => {
                setVoteModal(true);
              }}
            />
          );
        })}
      </div>
      {/* <SubmitWorkModal
        openSuccess={(val: number) => {}}
        visible={workModal}
        hackthon_id={+info?.hackthonId}
        min={info?.minSubmissionFee}
        onClose={(val: boolean) => {
          setWorkModal(val);
        }}
      />
      <VoteModal
        min={info?.minSubmissionFee}
        id={+info?.hackthonId}
        visible={voteModal}
        onClose={(val: boolean) => {
          setVoteModal(val);
        }}
      /> */}
    </div>
  );
};

export default HackthonDetailView;
