import { ReactElement, useEffect, useState } from "react";
import { addCommasToNumber } from "../../../../utils";
import { Button, Spin, message } from "antd";
import { HackathonRewardList } from "../../../../request/api";
import { useHackathon } from "../../../../hooks/hackthon";

interface Data {
  chain_id: string;
  hackathon_id: number;
  hackathon_name: string;
  pay_amount: number;
  pay_token_address: string;
  reward_amount: number;
  reward_claim_time: number;
  reward_claim_trx: string;
  reward_token_address: string;
  user: string;
  receive: number;
  is_online: boolean;
  pay_token_symbol: string;
}

const BonusTable = (props: { address: string }): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(999);
  const { CheckHackathon, ClaimHackathon } = useHackathon();
  const getList = async () => {
    setLoading(true);
    const result = await HackathonRewardList({
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
    // const list: Promise<{ id: number; amount: number }>[] = [];
    // data.data.item = data.data.item.map((item: Data) => {
    //   if (!item.is_online) {
    //     list.push(CheckHackathon(item.hackathon_id));
    //   }
    //   return {
    //     ...item,
    //     receive: 0,
    //   };
    // });
    // Promise.all(list).then((res) => {
    //   res.forEach((e: { id: number; amount: number }, index: number) => {
    //     if (e.id === data.data.item[index].hackathon_id) {
    //       data.data.item[index].receive = e.amount;
    //     }
    //   });
    //   setData(data.data.item);
    //   setLoading(false);
    // });
  };
  const cliamReward = async (_id: number) => {
    const result: any = await ClaimHackathon(_id);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success("Successfully received");
    getList();
  };
  useEffect(() => {
    getList();
  }, []);
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
        {data.map((item: Data, index: number) => {
          return (
            <div key={index} className="public-inner">
              <div className="public-p">
                <p>{index + 1}</p>
              </div>
              <div className="public-p o-p">
                <p>{item.hackathon_name}</p>
              </div>
              <div className="public-p">
                <p className="r-c">
                  {item.pay_amount < 1000
                    ? item.pay_amount
                    : addCommasToNumber(item.pay_amount)}
                  &nbsp;{item.pay_token_symbol}
                </p>
              </div>
              <div className="public-p">
                <p className="g-c">
                  {item.receive < 1000
                    ? item.receive
                    : addCommasToNumber(item.receive)}
                </p>
              </div>
              <div className="public-p">
                <Button
                  type="primary"
                  disabled={item.receive < 1 || !!item.reward_claim_trx}
                  className={`${
                    item.receive < 1 || !!item.reward_claim_trx ? "dis-btn" : ""
                  }`}
                  onClick={() => {
                    cliamReward(item.hackathon_id);
                  }}
                >
                  Receive
                </Button>
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

export default BonusTable;
