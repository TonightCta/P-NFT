import { ReactElement, useContext, useEffect, useState } from "react";
import { DateConvertMin, addCommasToNumber } from "../../../../utils";
import { Button, Spin, message } from "antd";
import { HackathonRewardList } from "../../../../request/api";
import { useHackathon } from "../../../../hooks/hackthon";
import { PNft } from "../../../../App";
import { useSwitchChain } from "../../../../hooks/chain";
import RewardModal from "./reward.modal";
import { flag } from '../../../../utils/source';

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
  reward_token_url: string;
  reward_token_symbol: string;
}

const BonusTable = (props: {
  address: string;
  chain: string;
}): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const { state } = useContext(PNft);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(999);
  const { CheckHackathon, ClaimHackathon } = useHackathon();
  const { switchC } = useSwitchChain();
  const [visible, setVisible] = useState<boolean>(false);
  const [info, setInfo] = useState<{ name: string; amount: number }>({
    name: "",
    amount: 0,
  });
  const getList = async () => {
    setLoading(true);
    const result = await HackathonRewardList({
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
  const cliamReward = async (_chain: string, _id: number) => {
    const chain: any = await switchC(+_chain);
    if (chain?.code) return;
    const result: any = await ClaimHackathon(_id);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success(
      "The claim request has been sent, please pay attention to the wallet balance after adding the token."
    );
    getList();
  };
  const addTokenTowWallet = async (_index: number) => {
    const win: any = window;
    try {
      await win.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: data[_index].reward_token_address,
            symbol: data[_index].reward_token_symbol,
            decimals: 18,
            image: data[_index].reward_token_url,
          },
        },
      });
    } catch (err: any) {
      message.error(err.message);
    }
  };
  const checkFN = async (_index: number) => {
    const chain: any = await switchC(+data[_index].chain_id);
    if (chain?.code) return;
    const result = await CheckHackathon(data[_index].hackathon_id);
    setInfo({
      name: data[_index].hackathon_name,
      amount: result,
    });
    setVisible(true);
    data[_index].reward_amount = result;
    setData(data);
  };
  useEffect(() => {
    getList();
  }, [state.chain]);
  return (
    <div className="bonus-table public-table">
      <div className="public-title">
        {[
          "#",
          "Hackathon",
          "Total Investments",
          "Total Rewards",
          "Add New Token",
          "Claim Time",
          "Apply",
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
              <div className="public-p o-p">
                <p>{item.hackathon_name}</p>
              </div>
              <div className="public-p">
                <p className="mobile-title">Total Investments</p>
                <p className="r-c">
                  {item.pay_amount < 1000
                    ? item.pay_amount
                    : addCommasToNumber(item.pay_amount)}
                  &nbsp;{item.pay_token_symbol}
                </p>
              </div>
              <div className="public-p flex-b">
                <p className="mobile-title">Total Rewards</p>
                <p className="g-c">
                  {item.reward_amount < 1000
                    ? item.reward_amount
                    : addCommasToNumber(item.reward_amount)}
                </p>
                {item.reward_amount <= 0 && (
                  <Button
                    type="primary"
                    disabled={item.is_online}
                    className={`check-btn ${item.is_online ? "dis-btn" : ""}`}
                    onClick={() => {
                      checkFN(index);
                    }}
                  >
                    Check
                  </Button>
                )}
              </div>
              <div className="public-p">
                <p className="mobile-title">Add New Token</p>
                <Button
                  type="primary"
                  className="add-btn"
                  disabled={item.is_online}
                  onClick={() => {
                    addTokenTowWallet(index);
                  }}
                >
                  Add To Wallet
                </Button>
              </div>
              <div className="public-p">
                <p className="mobile-title">Claim Time</p>
                {item.reward_claim_time === 0 ? (
                  "-"
                ) : (
                  <p>{DateConvertMin(item.reward_claim_time)}</p>
                )}
              </div>
              <div className="public-p">
                <p className="mobile-title">Apply</p>
                {item.reward_claim_trx !== "" ? (
                  <p
                    className="click"
                    onClick={() => {
                      window.open(
                        `https://piscan.plian.org/tx/${item.reward_claim_trx}?chain=1`
                      );
                    }}
                  >
                    {item.reward_claim_trx.substring(0, 8)}...{flag && item.reward_claim_trx.substring(item.reward_claim_trx.length - 8, item.reward_claim_trx.length)}
                  </p>
                ) : (
                  <Button
                    type="primary"
                    disabled={item.reward_amount < 1}
                    className={`${item.reward_amount < 1 ? "dis-btn" : ""}`}
                    onClick={() => {
                      cliamReward(item.chain_id, item.hackathon_id);
                    }}
                  >
                    Receive
                  </Button>
                )}
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
      <RewardModal
        visible={visible}
        onClose={(val: boolean) => {
          setVisible(val);
        }}
        name={info.name}
        amount={info.amount}
      />
    </div>
  );
};

export default BonusTable;
