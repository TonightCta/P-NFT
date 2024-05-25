import {
  ReactElement,
  ReactNode,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { Anchor, Button, message } from "antd";
import "./index.scss";
import HackthonCardNew from "./components/card";
import { PlusOutlined } from "@ant-design/icons";
import { useHackathon } from "../../hooks/hackthon";
import LaunchModal from "../hackthon/components/launch.modal";
import SubmitWorkModal from "../hackthon.detail/components/submit.work.modal";
import { PNft } from "../../App";
import { GetUrlKey, addCommasToNumber } from "../../utils";
import IconFont from "../../utils/icon";
import VoteModal from "../hackthon.detail/components/vote.modal";
import SuccessModal from "./components/success.modal";
import ConnectModal from "../../components/header.new/components/connect.modal";
// import { useSpring,animated } from 'react-spring'
// import CountUp from "react-countup";
// import React from "react";

interface Data {
  key: string;
  href: string;
  title: string;
  items: number[];
  coin: string[];
  sub: number;
  vote: number;
  id: number;
}

const data = [
  {
    id: 0,
    key: "part-0",
    href: "#part-0",
    title: "PNFT x Test",
    items: [1, 2, 3, 4, 5],
    coin: [
      require("../../assets/logo/1.png"),
      require("../../assets/logo/137.png"),
      require("../../assets/logo/solmain.png"),
    ],
    sub: 15,
    vote: 20000,
  },
  {
    id: 1,
    key: "part-1",
    href: "#part-1",
    title: "PNFT x Test",
    items: [1, 2, 3, 4, 5],
    coin: [
      require("../../assets/logo/1.png"),
      require("../../assets/logo/137.png"),
      require("../../assets/logo/solmain.png"),
    ],
    sub: 15,
    vote: 20000,
  },
  {
    id: 2,
    key: "part-2",
    href: "#part-2",
    title: "PNFT x Test",
    items: [1, 2, 3, 4, 5, 6, 7, 8],
    coin: [
      require("../../assets/logo/56.png"),
      require("../../assets/logo/25.png"),
    ],
    sub: 18,
    vote: 16738,
  },
  {
    id: 3,
    key: "part-3",
    href: "#part-3",
    title: "PNFT x Test",
    items: [1, 2, 3],
    coin: [
      require("../../assets/logo/btcmain.png"),
      require("../../assets/logo/43114.png"),
    ],
    sub: 7,
    vote: 56093,
  },
  {
    id: 4,
    key: "part-4",
    href: "#part-4",
    title: "PNFT x Test",
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    coin: [
      require("../../assets/logo/1.png"),
      require("../../assets/logo/137.png"),
    ],
    sub: 25,
    vote: 6093,
  },
];

const HackthonNewView = (): ReactElement<ReactNode> => {
  const containerRef = useRef(null);
  const [workModal, setWorkModal] = useState<boolean>(false);
  const [voteModal, setVoteModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [connectModalB, setConnectModal] = useState<boolean>(false);
  const [success, setSuccess] = useState<{ id: number; type: number }>({
    id: 0,
    type: 1,
  });
  const [chainData, setChainData] = useState<Data[]>(data);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const { QueryHackathonInfo, QueryNFT, QueryNFTInfo } = useHackathon();
  const [info, setInfo] = useState<any>();
  const { state } = useContext(PNft);
  const [lock, setLock] = useState<boolean>(false);
  const [share, setShare] = useState<number | string>("");
  const [shareInfo, setShareInfo] = useState<{ sub: number; vote: number }>({
    sub: 1,
    vote: 1,
  });

  const [active, setActive] = useState<string>("#part-1");
  const query = async () => {
    const info = await QueryHackathonInfo();
    const id = await QueryNFT();
    const nft = await QueryNFTInfo(+id - 1);
    setInfo(info);
    data[0] = {
      id: 0,
      key: "part-0",
      href: "#part-0",
      title: `PNFT x ${info?.symbol}`,
      items: [nft],
      coin: [require("../../assets/logo/8007736.png")],
      sub: 1,
      vote: 1,
    };
    setChainData([...data]);
    setShareInfo({ sub: 1, vote: 1 });
  };
  //   const [lock, setLock] = useState<boolean>(false);
  useEffect(() => {
    query();
    if (containerRef.current && GetUrlKey("id", window.location.href)) {
      (containerRef.current as any).scrollTo({
        top:
          (document.getElementById(
            `part-${GetUrlKey("id", window.location.href)}`
          )?.offsetTop as number) - 288,
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
  return (
    <div className="hackthon-new-view">
      <div className="title-oper">
        <p>Meme Hackathon</p>
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
          <Button type="primary" onClick={() => {
            setConnectModal(true);
          }}>Connect Wallet</Button>
        )}
      </div>
      <div className="share-p">
        <div className="label"></div>
        <div className="share-box">
          <p>
            {/* <React.Fragment>
            <CountUp start={0} end={100} decimals={0} separator="," />
          </React.Fragment> */}
            <span>{shareInfo.sub}</span>
            submissions
          </p>
          <p>
            total votes <span>{addCommasToNumber(shareInfo.vote)}</span>$PNFT
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
        <div className="left-name">
          {chainData.map((item: Data, index: number) => {
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
                  <p>
                    <img src={require("../../assets/images/pnft.png")} alt="" />
                    {item.title}
                  </p>
                  <div className="coin-list">
                    {item.coin.map((item: string, index: number) => {
                      return <img src={item} alt="" key={`${index}-coin`} />;
                    })}
                  </div>
                </div>
                <div className="right-icon">
                  <IconFont type="icon-fanhuijiantou" />
                </div>
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
              const filter: Data = data.filter((item: Data) => {
                return currentActiveLink === item.href;
              })[0];
              setShare(filter.id);
              setShareInfo({
                sub: filter.sub,
                vote: filter.vote,
              });
            }}
            items={data}
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
          {chainData.map((item: Data, index: number) => {
            return (
              <div key={index} id={item.key} style={{ marginBottom: "32px" }}>
                {/* <p
                  style={{ fontSize: "30px", color: "red", textAlign: "left" }}
                >
                  {item.title}
                </p> */}
                <div className="items-list">
                  {item.items.map((item: number | string, index: number) => {
                    return (
                      <HackthonCardNew
                        item={item}
                        address={state.address || ""}
                        key={index}
                        backModal={(id: number) => {
                          setVoteModal(true);
                        }}
                      />
                    );
                  })}
                  <div
                    className="add-work"
                    onClick={() => {
                      //TODO
                      //switch network
                      if (!state.address) {
                        message.error("You need connect the wallet first");
                        return;
                      }
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
        visible={workModal}
        openSuccess={(val: number) => {
          query();
          setSuccessModal(true);
          setSuccess({
            type: 2,
            id: val,
          });
          console.log("success submit");
        }}
        hackthon_id={+info?.hackthonId}
        min={info?.minSubmissionFee}
        onClose={(val: boolean) => {
          setWorkModal(val);
        }}
      />
      <VoteModal
        id={+info?.hackthonId}
        visible={voteModal}
        min={info?.minVotingAmount}
        onClose={(val: boolean) => {
          setVoteModal(val);
        }}
      />
      <SuccessModal
        visible={successModal}
        {...success}
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
