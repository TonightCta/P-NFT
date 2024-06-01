import { ReactElement, useEffect, useState } from "react";
import { DateConvertHour, addCommasToNumber } from "../../../../utils";
import { HackathonReferList } from "../../../../request/api";
import { Spin } from "antd";

interface Data{
    chain_id:string,
    hackathon_id:number,
    hackathon_name:string,
    referrer:number,
    refer_reward_token_symbol:string;
    refer_reward_token_url:string;
    refer_reward_amount:number;
    refer_reward_time:number;
    refer_reward_trx:string
}

const RecordTable = (props: { address: string,chain:string }): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(999);
  const getList = async () => {
    setLoading(true);
    const result = await HackathonReferList({
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
    console.log(data);
    setData(data.data.item);
    setLoading(false);
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="record-table public-table">
      <div className="public-title">
        {["#", "Hackathon", "Rebate", "Transaction", "Time"].map(
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
        {data.map((item: Data, index: number) => {
          return (
            <div key={index} className="public-inner">
              <div className="public-p">
                <p>{index + 1}</p>
              </div>
              <div className="nft-msg">
                <p className="b-text">{item.hackathon_name}</p>
              </div>
              <div className="public-p">
                <p className="p-c">{item.refer_reward_amount < 999 ? item.refer_reward_amount : addCommasToNumber(200120)}&nbsp;{item.refer_reward_token_symbol}</p>
              </div>
              <div className="public-p">
                <p className="click" onClick={() => {
                    window.open(`https://piscan.plian.org/tx/${item.refer_reward_trx}?chain=1`)
                }}>{item.refer_reward_trx.substring(0,12)}...{item.refer_reward_trx.substring(item.refer_reward_trx.length - 12,item.refer_reward_trx.length)}</p>
              </div>
              <div className="public-p">
                <p>{DateConvertHour(item.refer_reward_time)}</p>
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

export default RecordTable;
