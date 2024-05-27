import { ReactElement } from "react";
import { addCommasToNumber } from "../../../../utils";
import { Button } from "antd";

const BonusTable = (): ReactElement => {
  return (
    <div className="bonus-table public-table">
      <div className="public-title">
        {["#", "Hackathon", "Total Investments", "Total Rewards", "Apply"].map(
          (item: string, index: number) => {
            return (
              <p key={index} className={`${item === "#" ? "" : ""}`}>
                {item}
              </p>
            );
          }
        )}
      </div>
      <div className="public-table">
        {[1, 2, 3].map((item: number, index: number) => {
          return (
            <div key={index} className="public-inner">
              <div className="public-p">
                <p>{item}</p>
              </div>
              <div className="public-p o-p">
                <p>
                  NiftyIN & pizzap jointly NiftyIN & pizzap jointly NiftyIN &
                  pizzap jointly NiftyIN & pizzap jointly NiftyIN & pizzap
                  jointly NiftyIN & pizzap  jointly jointly
                </p>
              </div>
              <div className="public-p">
                <p className="r-c">{addCommasToNumber(200120)}&nbsp;PI</p>
              </div>
              <div className="public-p">
                <p className="g-c">{addCommasToNumber(600000)}</p>
              </div>
              <div className="public-p">
                <Button type="primary">Receive</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BonusTable;
