import { ReactElement, useEffect, useState } from "react";
import { DateConvertHour, addCommasToNumber } from "../../../../utils";
import { HackathonVoteList } from "../../../../request/api";
import { Spin } from "antd";

interface Data {
  chain_id: string;
  hackathon_id: number;
  hackathon_name: string;
  hackathon_item_id: number;
  voter: string;
  vote_token_address: "";
  voter_amount: number;
  voter_time: number;
  voter_trx: string;
  url:string
}

const HistoryTable = (props: { address: string,chain:string }): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(999);
  const getList = async () => {
    setLoading(true);
    const result = await HackathonVoteList({
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
    setData(data.data.item)
    setLoading(false);
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="history-table public-table">
      <div className="public-title">
        {["#", "NFT", "Total", "Vote Date", "Hackthon", "Transaction"].map(
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
                <img
                  src={item.url}
                  alt=""
                />
                <p>#{item.hackathon_id}</p>
              </div>
              <div className="public-p">
                <p>{item.voter_amount < 999 ? item.voter_amount : addCommasToNumber(item.voter_amount)}</p>
              </div>
              <div className="public-p">
                <p>{DateConvertHour(item.voter_time)}</p>
              </div>
              <div className="public-p">
                <p>{item.hackathon_name}</p>
              </div>
               <div className="public-p">
                <p className="click" onClick={() => {
                    window.open(`https://piscan.plian.org/tx/${item.voter_trx}?chain=1`)
                }}>{item.voter_trx.substring(0,8)}...{item.voter_trx.substring(item.voter_trx.length - 8,item.voter_trx.length)}</p>
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

export default HistoryTable;
