import { ReactElement, useEffect, useState } from "react";
import { DateConvertS, addCommasToNumber } from "../../../../utils";
import { HackathonCreateList } from "../../../../request/api";
import { Spin } from "antd";

interface Data {
  chain_id: string;
  hackathon_id: number;
  hackathon_name: string;
  hackathon_item_id: number;
  is_online: boolean;
  creator: string;
  creat_time: number;
  creat_trx: string;
  name: string;
  symbol: string;
  new_token_address: string;
  total_supply: number;
  end_time: number;
  total_contribution_amount:number,
  total_submit_item:number;
  pay_token_symbol:string;
  pay_token_url:string;
}

const HackathonTable = (props: { address: string,chain:string }): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(999);
  const getList = async () => {
    setLoading(true);
    const result = await HackathonCreateList({
      chain_id:props.chain,
      user_address: props.address,
      page_size: 100,
      page_num: 1,
    });
    const { data } = result;
    setTotal(data.data.total);
    if (!data.data.item) {
      setData([]);
      setLoading(false);
      return;
    };
    setData(data.data.item);
    setLoading(false);
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="hackathon-table public-table">
      <div className="public-title">
        {[
          "#",
          "Hackathon",
          "Symbol",
          "Pay Token",
          "Total Supply",
          "Total Votes",
          "Total Image",
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
        {data.map((item: Data, index: number) => {
          return (
            <div key={index} className="public-inner">
              <div className="public-p">
                <p>{index + 1}</p>
              </div>
              <div className="public-p">
                <p className="b-text">{item.hackathon_name}</p>
              </div>
              <div className="public-p">
                <p className="b-text">{item.symbol}</p>
              </div>
              <div className="public-p p-icon">
                <img src={item.pay_token_url} alt="" />
                <p>{item.pay_token_symbol}</p>
              </div>
              <div className="public-p">
                <p className="y-c">{item.total_supply < 999 ? item.total_supply : addCommasToNumber(item.total_supply)}</p>
              </div>
              <div className="public-p">
                {/* {addCommasToNumber(200000000)} */}
                <p className="g-c">{item.total_contribution_amount < 999 ? item.total_contribution_amount : addCommasToNumber(item.total_contribution_amount)}</p>
              </div>
              <div className="public-p">
                <p>{item.total_submit_item}</p>
              </div>
              <div className="time-line">
                <div className="g-box">
                  <div
                    className="box-i"
                    style={{
                      width: `${Math.ceil(
                        (Date.now() / 1000 - item.creat_time) /
                          (item.end_time - item.creat_time)
                      )}%`,
                    }}
                  ></div>
                </div>
                <p>
                  {Math.ceil(
                    (Date.now() / 1000 - item.creat_time) /
                      (item.end_time - item.creat_time)
                  )}
                  %
                </p>
              </div>
              <div className="public-p">
                <p>{DateConvertS(item.end_time)}</p>
              </div>
            </div>
          );
        })}
      </div>
      {loading && (
        <div className="loading-box">
          <Spin size="large" />
        </div>
      )}
      {!loading && total < 1 && <p className="no-more">No More</p>}
    </div>
  );
};

export default HackathonTable;
