import { ReactElement } from "react";
import { addCommasToNumber } from "../../../../utils";

const HackathonTable = (): ReactElement => {
  return (
    <div className="hackathon-table public-table">
      <div className="public-title">
        {[
          "#",
          "Hackathon",
          "Symbol",
          "Descrption",
          "Pay Token",
          "Total Supply",
          "Total Votes",
          "Total NFT",
          "Timeline",
          "End Time",
        ].map((item: string, index: number) => {
          return (
            <p key={index} className={`${item === "#" ? "" : ""}`}>
              {item}
            </p>
          );
        })}
      </div>
      <div className="public-table">
        {[1, 2, 3].map((item: number, index: number) => {
          return (
            <div key={index} className="public-inner">
              <div className="public-p">
                <p>{item}</p>
              </div>
              <div className="public-p">
                <p className="b-text">
                  NiftyIN & pizzap jointly NiftyIN & pizzap jointly NiftyIN &
                  pizzap jointly NiftyIN & pizzap jointly
                </p>
              </div>
              <div className="symbol">
                <img
                  src={require("../../../../assets/logo/8007736.png")}
                  alt=""
                />
              </div>
              <div className="public-p">
                <p className="l-3 f-14">
                  PAI Space is a collection of Pizzap AI Creating, co-owned and
                  PAI Space is a collection of Pizzap AI Creating, co-owned and
                </p>
              </div>
              <div className="public-p">
                <p>PI</p>
              </div>
              <div className="public-p">
                <p className="y-c">{addCommasToNumber(100100000)}</p>
              </div>
              <div className="public-p">
                <p className="g-c">{addCommasToNumber(200000000)}</p>
              </div>
              <div className="public-p">
                <p>200</p>
              </div>
              <div className="time-line">
                <div className="g-box">
                  <div
                    className="box-i"
                    style={{
                      width: `${Math.ceil(
                        ((new Date().getTime() + 864000000 - Date.now()) /
                          2626560000) *
                          100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p>
                  {Math.ceil(
                    ((new Date().getTime() + 864000000 - Date.now()) /
                      2626560000) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="public-p">
                <p>31/05/2024</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HackathonTable;
