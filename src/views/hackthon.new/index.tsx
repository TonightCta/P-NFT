import {
  ReactElement,
  ReactNode,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { Anchor, Button, Popover, Spin, message } from "antd";
import "./index.scss";
import HackthonCardNew from "./components/card";
import { PlusOutlined } from "@ant-design/icons";
import LaunchModal from "../hackthon/components/launch.modal";
import SubmitWorkModal from "../hackthon.detail/components/submit.work.modal";
import { PNft } from "../../App";
import {
  DateConvertS,
  FilterHackathonNet,
  GetUrlKey,
  HackathonNet,
  HackathonNetInt,
  addCommasToNumber,
} from "../../utils";
import IconFont from "../../utils/icon";
import VoteModal from "../hackthon.detail/components/vote.modal";
import SuccessModal from "./components/success.modal";
import ConnectModal from "../../components/header.new/components/connect.modal";
import { HackathonItemList, HackathonList } from "../../request/api";
import { Type } from "../../utils/types";
import { HackathonSupport } from "../../hooks/hackthon";
// import { useSpring,animated } from 'react-spring'
// import CountUp from "react-countup";
// import React from "react";

interface Data {
  key: string;
  href: string;
  title: string;
  items: [];
  symbol: string;
  chain_id: string;
  coin: string[];
  sub: number;
  vote: number;
  id: number;
  hackathon_id: number;
  min_submission_fee: number;
  min_voting_amount: number;
  is_online: boolean;
  total_submit_item: number;
  total_contribution_amount: number;
  creat_time: number;
  end_time: number;
  hackathon_name: string;
  pay_token_address: string;
  create_address: string;
  pay_token_symbol: string;
  pay_token_url: string;
}

export interface Item {
  creator: string;
  hackathon_id: number;
  hackthon_item_id: number;
  loading: boolean;
  url: string;
  votes: number;
}

const HackthonNewView = (): ReactElement<ReactNode> => {
  const containerRef = useRef(null);
  const [workModal, setWorkModal] = useState<boolean>(false);
  const [voteModal, setVoteModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [connectModalB, setConnectModal] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<{ left: boolean; right: boolean }>({
    left: true,
    right: true,
  });
  const [success, setSuccess] = useState<{ id: number; type: number }>({
    id: 0,
    type: 1,
  });
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [info, setInfo] = useState<{
    hackathon_id: number;
    min_voting_amount: number;
    min_submission_fee: number;
    chain_id: string;
    pay_token_address: string;
    create_address: string;
    pay_token_symbol: string;
    pay_token_url: string;
  }>({
    hackathon_id: 0,
    min_voting_amount: 0,
    min_submission_fee: 0,
    chain_id: "",
    pay_token_address: "",
    create_address: "",
    pay_token_symbol: "",
    pay_token_url: "",
  });
  const { state, dispatch } = useContext(PNft);
  const [lock, setLock] = useState<boolean>(false);
  const [share, setShare] = useState<number | string>("");
  const [shareInfo, setShareInfo] = useState<{
    sub: number;
    vote: number | string;
    symbol: String;
  }>({
    sub: 0,
    vote: 0,
    symbol: "",
  });
  const [tokenID, setTokenID] = useState<number>(0);
  const [hackathonList, setHackathonList] = useState<Data[]>([]);
  const [active, setActive] = useState<string>("#part-0");
  const getHackathonList = async () => {
    if (state.hackathon !== "") {
      setHackathonList(JSON.parse(state.hackathon as string));
      setLoading({
        left: false,
        right: false,
      });
    }
    const result = await HackathonList({
      chain_id: !state.address
        ? ""
        : HackathonSupport.indexOf(state.chain as string) < 0
        ? ""
        : (state.chain as string),
      page_size: 10,
      page_num: 1,
    });
    const { data } = result;
    setShare(data.data.item[0].hackathon_id);
    setShareInfo({
      sub: data.data.item[0].total_submit_item,
      vote: data.data.item[0].total_contribution_amount.toFixed(2),
      symbol: data.data.item[0].pay_token_symbol,
    });
    data.data.item = data.data.item.map((item: Data, index: number) => {
      return {
        ...item,
        key: `part-${index}`,
        href: `#part-${index}`,
        items: null,
        loading: false,
      };
    });
    const list: any[] = [];
    data.data.item.forEach((e: Data) => {
      if (e.items === null) {
        // const it = await getHackathonItems(e.hackathon_id);
        // e.items = it ? it : [];
        list.push(getHackathonItems(e.hackathon_id, e.chain_id));
      }
    });
    Promise.all(list).then((res) => {
      const results = res.map((item: any) =>
        item.data.data.item
          ? item.data.data.item.map((item: Item) => {
              return {
                ...item,
                loading: true,
              };
            })
          : []
      );
      data.data.item.forEach((e: Data, index: number) => {
        e.items = results[index];
        // if (e.hackathon_id === results[index].hackathon_id) {
        // }
      });
      setHackathonList(data.data.item);
      dispatch({
        type: Type.SET_HACKATHON,
        payload: {
          hackathon: data.data.item,
        },
      });
      setLoading({
        left: false,
        right: false,
      });
      setReload(false);
    });
  };
  const getHackathonItems = async (_id: number, _chain_id: string) => {
    return HackathonItemList({
      chain_id: _chain_id,
      page_size: 100,
      page_num: 1,
      hackathon_id: _id,
    });
  };
  useEffect(() => {
    if (!loading.left && !loading.right) {
      setReload(true);
    }
    getHackathonList();
  }, [state.address, state.chain]);
  useEffect(() => {
    if (containerRef.current && GetUrlKey("id", window.location.href)) {
      (containerRef.current as any).scrollTo({
        top:
          (document.getElementById(
            `part-${GetUrlKey("id", window.location.href)}`
          )?.offsetTop as number) - 256,
        behavior: "smooth",
      });
    }
  }, []);
  const getContainer = () => {
    return containerRef.current;
  };
  const handleClick = (e: any, _href: string) => {
    e.preventDefault();
    document.querySelector(_href)?.scrollIntoView({ behavior: "smooth" });
  };
  const updateHackathonItems = async (_id: number) => {
    const result = await HackathonItemList({
      chain_id: state.chain,
      page_size: 10,
      page_num: 1,
      hackathon_id: _id,
    });
    const { data } = result;
    hackathonList.forEach((item: Data, index: number) => {
      if (item.hackathon_id === _id) {
        hackathonList[index].items = data.data.item;
      }
    });
    setHackathonList(hackathonList);
  };
  const fixTime = (_create: number, _end: number) => {
    const now: number = Date.now() / 1000;
    const progress: number = now - _create;
    const dur = _end - _create;
    return Number((progress / dur).toFixed(0));
  };
  const [chainPop, setChainPop] = useState<boolean>(false);
  const chainContent = (
    <div
      className="connect-menu connect-menu-chain"
      onClick={() => {
        setChainPop(false);
      }}
    >
      <ul>
        {HackathonNet.map((item: HackathonNetInt, index: number) => {
          return (
            <li
              key={index}
              onClick={() => {
                // setChain(item.chain_id);
              }}
            >
              <img src={item.chain_logo} alt="" />
              <p>{item.chain_name}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <div className="hackthon-new-view">
      <div className="title-oper">
        <p>Meme Hackathon</p>
        <div className="chain-btn">
          {false && (
            <Popover
              open={chainPop}
              onOpenChange={(e: boolean) => {
                setChainPop(e);
              }}
              content={chainContent}
              title={null}
              trigger="click"
            >
              <div className="chain-box">
                {/* {!chain ? (
                  "Not supported"
                ) : (
                  <img src={FilterHackathonNet(chain).chain_logo} alt="" />
                )} */}
                <IconFont type="icon-xiangxia" />
              </div>
            </Popover>
          )}
          {state.address ? (
            <Button
              type="primary"
              onClick={() => {
                if (!state.address) {
                  message.error("You need connect the wallet first");
                  return;
                }
                setVisible(true);
              }}
            >
              Launch Hackathon
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setConnectModal(true);
              }}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      <div className="share-p">
        <div className="label"></div>
        <div className="share-box">
          <p>
            Submission
            <span>{shareInfo.sub}</span>
          </p>
          <p>
            Total Supports
            <span>
              {addCommasToNumber(+shareInfo.vote)}
              <i>${shareInfo.symbol}</i>
            </span>
          </p>
          <Button
            type="primary"
            onClick={() => {
              const windowName = "newWindow";
              const windowFeatures = "width=800,height=600,top=100,left=100";
              const url = `https://test.pizzap.io/#/?referrer=${state.address}&id=${share}`;
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  "Alex share"
                )}&url=${encodeURIComponent(url)}`,
                windowName,
                windowFeatures
              );
            }}
          >
            Share
            <IconFont type="icon-arrow-up-right" />
          </Button>
        </div>
      </div>
      <div className="new-view-inner">
        {reload && (
          <div className="loading-big">
            <Spin size="large" />
          </div>
        )}
        <div className="left-name">
          {loading.left && <Spin size="large" style={{ marginTop: "24px" }} />}
          {hackathonList.map((item: Data, index: number) => {
            return (
              <div
                className={`anchor-box ${
                  active === item.href ? "active-anchor" : ""
                }`}
                key={index}
                onClick={(e) => {
                  handleClick(e, item.href);
                  setLock(true);
                  setActive(item.href);
                  setTimeout(() => {
                    setLock(false);
                  }, 2000);
                }}
              >
                <div className="left-msg">
                  <p className="active-line"></p>
                  <div className="meme-msg">
                    <p className="symbol-name">
                      <img src={item.pay_token_url} alt="" />
                      {FilterHackathonNet(item.chain_id).token[0].symbol} x{" "}
                      {item.symbol}
                    </p>
                    <div className="coin-list">
                      <img
                        src={FilterHackathonNet(item.chain_id).chain_logo}
                        alt=""
                      />
                    </div>
                    <div className="date-msg">
                      <p>{item.is_online ? "ONGOING" : "ENDED"}</p>
                      <div className="progress-box">
                        <div className="create-date p-date">
                          {DateConvertS(item.creat_time)}
                        </div>
                        <div className="end-date p-date">
                          {DateConvertS(item.end_time)}
                        </div>
                        <div
                          className="box-i"
                          style={{
                            width: `${
                              item.is_online
                                ? fixTime(item.creat_time, item.end_time)
                                : 100
                            }%`,
                          }}
                        >
                          <div
                            className="progress-text"
                            style={{
                              left: `calc(${
                                item.is_online
                                  ? fixTime(item.creat_time, item.end_time)
                                  : 100
                              }% - 19px)`,
                            }}
                          >
                            {item.is_online
                              ? fixTime(item.creat_time, item.end_time)
                              : 100}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="right-icon">
                  <IconFont type="icon-fanhuijiantou" />
                </div> */}
              </div>
            );
          })}
          <Anchor
            getContainer={getContainer as any}
            onClick={(e) => {
              e.preventDefault();
            }}
            onChange={(currentActiveLink: string) => {
              if (!currentActiveLink || lock) return;
              setActive(currentActiveLink);
              const filter: Data = hackathonList.filter((item: any) => {
                return currentActiveLink === item.href;
              })[0];
              // if (filter.items.length < 1 && filter.loading) {
              //   getHackathonItems();
              // }
              setShare(filter.hackathon_id);
              setShareInfo({
                sub: filter.total_submit_item,
                vote: filter.total_contribution_amount.toFixed(2),
                symbol: filter.pay_token_symbol,
              });
            }}
            items={hackathonList}
          />
        </div>
        <div className="right-content" ref={containerRef}>
          {/* <div className="test-share">
            <p>Share Hackthon Num:</p>
            <input
              type="number"
              placeholder="num(1-4)"
              value={share}
              onChange={(e) => {
                setShare(e.target.value);
              }}
            />
            <p>{`https://twitter.com/intent/tweet?url=https://test.pizzap.io/#/hackthon-n?referrer=${state.address}&id=${share}`}</p>
            <Button
              type="primary"
              onClick={() => {
                if (!share) {
                  message.error("Please enter the hackthon num");
                  return;
                }
                
              }}
            >
              Share
            </Button>
          </div> */}
          {loading.right && (
            <div className="loading-box" style={{ marginTop: "120px" }}>
              <Spin size="large" />
            </div>
          )}
          {hackathonList.map((item: Data, index: number) => {
            return (
              <div key={index} id={item.key} style={{ marginBottom: "32px" }}>
                <p
                  style={{
                    fontSize: "24px",
                    color: "#FA43A8",
                    textAlign: "left",
                  }}
                >
                  {item.hackathon_name}
                </p>
                <div className="items-list">
                  {item.items &&
                    item.items.map((items: Item, index: number) => {
                      return (
                        <HackthonCardNew
                          item={items}
                          address={state.address || ""}
                          key={index}
                          chain_id={item.chain_id}
                          min={item.min_voting_amount}
                          online={item.is_online}
                          backModal={(token: number) => {
                            setTokenID(token);
                            setInfo({
                              hackathon_id: item.hackathon_id,
                              min_submission_fee: item.min_submission_fee,
                              min_voting_amount: item.min_voting_amount,
                              chain_id: item.chain_id,
                              pay_token_address: item.pay_token_address,
                              create_address: item.create_address,
                              pay_token_symbol: item.pay_token_symbol,
                              pay_token_url: item.pay_token_url,
                            });
                            setVoteModal(true);
                          }}
                        />
                      );
                    })}
                  <div
                    className="add-work"
                    onClick={() => {
                      if (!state.address) {
                        message.error("You need connect the wallet first");
                        return;
                      }
                      setInfo({
                        hackathon_id: item.hackathon_id,
                        min_submission_fee: item.min_submission_fee,
                        min_voting_amount: item.min_voting_amount,
                        chain_id: item.chain_id,
                        pay_token_address: item.pay_token_address,
                        create_address: item.create_address,
                        pay_token_symbol: item.pay_token_symbol,
                        pay_token_url: item.pay_token_url,
                      });
                      setWorkModal(true);
                    }}
                  >
                    <PlusOutlined />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <LaunchModal
        visible={visible}
        address={state.address || ""}
        openSuccess={(val: number) => {
          getHackathonList();
          setSuccessModal(true);
          setSuccess({
            type: 1,
            //TODO
            id: 0,
          });
        }}
        onClose={(val: boolean) => {
          setVisible(val);
        }}
      />
      <SubmitWorkModal
        {...info}
        visible={workModal}
        openSuccess={(hackathon_id: number) => {
          updateHackathonItems(hackathon_id);
          setSuccessModal(true);
          setSuccess({
            type: 2,
            id: hackathon_id,
          });
        }}
        hackthon_id={info.hackathon_id}
        min={info.min_submission_fee}
        onClose={(val: boolean) => {
          setWorkModal(val);
        }}
      />
      <VoteModal
        {...info}
        token_id={tokenID}
        visible={voteModal}
        min={info.min_voting_amount}
        onClose={(val: boolean) => {
          setVoteModal(val);
        }}
        onSuccess={(hackathon_id: number) => {
          updateHackathonItems(hackathon_id);
        }}
      />
      <SuccessModal
        visible={successModal}
        {...success}
        min={info.min_voting_amount}
        chain_id={info.chain_id}
        address={state.address || ""}
        onClose={(val: boolean) => {
          setSuccessModal(val);
        }}
      />
      <ConnectModal
        visible={connectModalB}
        close={(val: boolean) => {
          setConnectModal(val);
        }}
      />
    </div>
  );
};

export default HackthonNewView;
