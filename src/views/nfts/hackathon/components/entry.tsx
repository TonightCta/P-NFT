import { ReactElement, useEffect, useState } from "react";
import { DateConvertHour, addCommasToNumber } from "../../../../utils";
import { HackathonSubmitList } from "../../../../request/api";
import { Spin } from "antd";

interface Data {
  chain_id: string;
  hackathon_id: number;
  hackathon_name: string;
  hackathon_item_id: number;
  creator: string;
  creat_time: number;
  creat_trx: string;
  url: string;
  votes: number;
}

const EntryTable = (props: {
  address: string;
  chain: string;
}): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(999);
  const getList = async () => {
    setLoading(true);
    const result = await HackathonSubmitList({
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
    <div className="entry-table public-table">
      <div className="public-title">
        {["#", "NFT", "Total", "Submit Date", "Hackthon", "Transaction"].map(
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
                <img src={item.url} alt="" />
                <p>#{item.hackathon_id}</p>
              </div>
              <div className="public-p">
                <p>
                  {item.votes < 999
                    ? item.votes
                    : addCommasToNumber(item.votes)}
                </p>
                <p className="mobile-title">Total Votes</p>
              </div>
              <div className="public-p">
                <p className="mobile-title">End Time</p>
                <p>{DateConvertHour(item.creat_time)}</p>
              </div>
              <div className="public-p">
                <p className="mobile-title">Hackathon</p>
                <p>{item.hackathon_name}</p>
              </div>
              <div className="public-p">
                <p className="mobile-title">Transaction</p>
                <p
                  className="click"
                  onClick={() => {
                    window.open(
                      `https://piscan.plian.org/tx/${item.creat_trx}?chain=1`
                    );
                  }}
                >
                  {item.creat_trx.substring(0, 8)}...
                  {item.creat_trx.substring(
                    item.creat_trx.length - 8,
                    item.creat_trx.length
                  )}
                </p>
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
      {!loading && total < 1 && (
        <div className="no-more-new">
          <img
            src={require("../../../../assets/images/no.more.new.png")}
            alt=""
          />
          <p>No Data</p>
        </div>
      )}
    </div>
  );
};

export default EntryTable;
