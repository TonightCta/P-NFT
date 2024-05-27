import { ReactElement } from "react";
import { addCommasToNumber } from "../../../../utils";

const EntryTable = (): ReactElement => {
  return (
    <div className="entry-table public-table">
      <div className="public-title">
        {["#", "NFT", "Total", "Submit Date", "Hackthon", "End Time"].map(
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
              <div className="nft-msg">
                <img
                  src={require("../../../../assets/images/test2.png")}
                  alt=""
                />
                <p>Alex NFT</p>
              </div>
              <div className="public-p">
                <p>{addCommasToNumber(20000)}&nbsp;PI</p>
              </div>
              <div className="public-p">
                <p>10:20:53/5/24/2024</p>
              </div>
              <div className="public-p">
                <p>My Web3 Working Brunch</p>
              </div>
              <div className="public-p">
                <p>10:20:53/5/24/2024</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntryTable;
