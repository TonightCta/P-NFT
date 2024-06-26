import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import IconFont from "../../utils/icon";
import { Button, Spin } from "antd";
import "./index.scss";
import FooterNew from "../screen.new/components/footer.new";
import VoteModal from "../hackthon.detail/components/vote.modal";
import { PNft } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { HackathonInfo } from "../../request/api";
import { FilterHackathonNet, addCommasToNumber } from "../../utils";

interface Info {
  chain_id: string;
  hackathon_id: number;
  hackthon_item_id: number;
  creator: string;
  url: string;
  votes: number;
  pay_token_address: string;
  create_address: string;
  pay_token_symbol: string;
  pay_token_url: string;
  rank: number;
}

const HackthonDetailNewView = (): ReactElement<ReactNode> => {
  const [voteModal, setVoteModal] = useState<boolean>(false);
  const { state } = useContext(PNft);
  const searchParams = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<Info>({
    chain_id: "",
    hackathon_id: 0,
    hackthon_item_id: 0,
    creator: "",
    url: "",
    votes: 0,
    pay_token_address: "",
    create_address: "",
    pay_token_symbol: "",
    pay_token_url: "",
    rank: 0,
  });
  const getInfo = async () => {
    const result = await HackathonInfo({
      chain_id: searchParams.chain,
      hackathon_item_id: +(searchParams.id as string),
      page_size: 10,
      page_num: 1,
    });
    const { data } = result;
    setInfo(data);
  };
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <div className="hackthon-detail-new-view">
      <p className="back-title">
        <IconFont
          type="icon-fanhuijiantou"
          onClick={() => {
            navigate("/hackathon");
          }}
        />
        Meme Hackathon
      </p>
      <div className="detail-inner">
        <div className="left-pr">
          <img
            className="dog"
            src={require("../../assets/images/sit.dog.png")}
            alt=""
          />
          <div className="bg-y"></div>
          <div className="left-nft">
            {loading && (
              <div className="loading-box">
                <Spin size="large" />
              </div>
            )}
            <img
              src={info.url}
              alt=""
              onLoad={() => {
                setLoading(false);
              }}
            />
          </div>
        </div>
        <div className="right-msg">
          <div>
            <div className="id-token">
              <p>#{info.hackathon_id}</p>
              <p className="chain-li">
                <img
                  src={FilterHackathonNet(String(info.chain_id))?.chain_logo}
                  alt=""
                />
              </p>
            </div>
            <div className="vote-box">
              <p>
                <IconFont type="icon-a-zu1441" />
                {info.votes < 1 ? info.votes : addCommasToNumber(info.votes)}
                <span className="w-text">&nbsp;{info.pay_token_symbol}</span>
              </p>
              <p>
                <IconFont type="icon-a-zu1590" />
                {info.rank}
              </p>
              <p>
                <IconFont type="icon-a-zu1439" className="gr-c" />
                {info.create_address}
              </p>
            </div>
          </div>
          <div className="oper-box">
            <Button
              type="primary"
              onClick={() => {
                setVoteModal(true);
              }}
            >
              Vote
              <img src={require('../../assets/images/dog.fot.png')} alt="" />
            </Button>
            <Button
              type="default"
              onClick={() => {
                const windowName = "newWindow";
                const windowFeatures = "width=800,height=600,top=100,left=100";
                const url = `https://test.pizzap.io/#/hackthon/${searchParams.id}/${searchParams.min}/${searchParams.chain}?referrer=${state.address}`;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    "Memehack is a fair and community-governed platform for launching Memecoins. It also supports the secondary creation based on popular Memes. Everyone is welcome to launch their Memecoins in Memehack. Join us in shaping the future of meme-based culture."
                  )}&url=${encodeURIComponent(url)}`,
                  windowName,
                  windowFeatures
                );
              }}
            >
              Share&Earn
              <IconFont type="icon-a-lujing555" />
            </Button>
          </div>
        </div>
      </div>
      <div className="msg-card">
        {/* <div className="text">
          <p>Description:</p>
          <p>
            This time, the theme will focus on the relaxed freedom and boundless
            creativity of the Web3 working environment, allowing your
            imagination to flourish in an unrestricted space!Many Web3
            professionals share their working meals in their spare time because
            in this shared and open environment, creativity and cuisine have
            become an inseparable part.
          </p>
        </div> */}
        <div className="text">
          <p>Owner:</p>
          <p>{info.creator}</p>
        </div>
        <div className="text">
          <p>Address:</p>
          <p>{info.create_address}</p>
        </div>
      </div>
      <VoteModal
        {...info}
        chain_id={searchParams.chain as string}
        min={+(searchParams.min as string)}
        token_id={info.hackthon_item_id}
        visible={voteModal}
        onClose={(val: boolean) => {
          setVoteModal(val);
        }}
        onSuccess={() => {
          getInfo();
        }}
      />
      <FooterNew />
    </div>
  );
};

export default HackthonDetailNewView;
