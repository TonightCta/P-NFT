import { ReactElement, useEffect, useState } from "react";
import { DateConvertHour, addCommasToNumber } from "../../../../utils";
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
  total_contribution_amount: number;
  total_submit_item: number;
  pay_token_symbol: string;
  pay_token_url: string;
}

const HackathonTable = (props: {
  address: string;
  chain: string;
}): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(999);
  const getList = async () => {
    setLoading(true);
    const result = await HackathonCreateList({
      chain_id: props.chain,
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
    }
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
                <p className="mobile-title">Symbol</p>
                <p className="b-text">{item.symbol}</p>
              </div>
              <div className="public-p p-icon">
                <p className="mobile-title">Pay Token</p>
                <img src={item.pay_token_url} alt="" />
                <p>{item.pay_token_symbol}</p>
              </div>
              <div className="public-p">
                <p className="mobile-title">Total Supply</p>
                <p className="y-c">
                  {item.total_supply < 999
                    ? item.total_supply
                    : addCommasToNumber(item.total_supply)}
                </p>
              </div>
              <div className="public-p">
                <p className="g-c">
                  {item.total_contribution_amount < 999
                    ? item.total_contribution_amount
                    : addCommasToNumber(item.total_contribution_amount)}
                </p>
                <p className="mobile-title">Total Votes</p>
              </div>
              <div className="public-p">
                <p className="mobile-title">Total Image</p>
                <p>{item.total_submit_item}</p>
              </div>
              <div className="time-line">
                <div className="g-box">
                  <div
                    className="box-i"
                    style={{
                      width: `${
                        item.is_online
                          ? Math.ceil(
                              ((Date.now() / 1000 - item.creat_time) /
                                (item.end_time - item.creat_time)) *
                                100
                            )
                          : 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p>
                  {item.is_online
                    ? Math.ceil(
                        ((Date.now() / 1000 - item.creat_time) /
                          (item.end_time - item.creat_time)) *
                          100
                      )
                    : 100}
                  %
                </p>
              </div>
              <div className="public-p">
                <p className="mobile-title">End Time</p>
                <p>{DateConvertHour(item.end_time)}</p>
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
      {!loading && total < 1 && <div className="no-more-new">
          <img src={require('../../../../assets/images/no.more.new.png')} alt="" />
          <p>No Data</p>
        </div>}
    </div>
  );
};

export default HackathonTable;
