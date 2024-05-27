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
import { addCommasToNumber } from "../../utils";

interface Info {
  hackathon_id: number;
  hackthon_item_id: number;
  creator: string;
  url: string;
  votes: number;
}

const HackthonDetailNewView = (): ReactElement<ReactNode> => {
  const [voteModal, setVoteModal] = useState<boolean>(false);
  const { state } = useContext(PNft);
  const searchParams = useParams();
  const navigate = useNavigate();
  const [loading,setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<Info>({
    hackathon_id: 0,
    hackthon_item_id: 0,
    creator: "",
    url: "",
    votes: 0,
  });
  const getInfo = async () => {
    const result = await HackathonInfo({
      chain_id: "8007736",
      hackathon_item_id: +(searchParams.id as string),
      page_size: 10,
      page_num: 1,
    });
    console.log(result);
    const { data } = result;
    setInfo(data);
  };
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <div className="hackthon-detail-new-view">
      <div className="detail-inner">
        <div className="left-nft">
          {
            loading && <div className="loading-box">
              <Spin size="large"/>
            </div>
          }
          <img src={info.url} alt="" onLoad={() => {
            setLoading(false);
          }}/>
        </div>
        <div className="right-msg">
          <div>
            <p className="back-title">
              <IconFont
                type="icon-fanhuijiantou"
                onClick={() => {
                  navigate("/hackathon");
                }}
              />
              Meme Hackathon
            </p>
            <p className="nft-name">NFT Name</p>
            <div className="owner-msg">
              <IconFont type="icon-a-zu1439" className="gr-c" />
              <p>Owner</p>
              <p className="bold">1006fb</p>
              <p className="address">{info.creator}</p>
            </div>
            <p className="desc">
              PAI Space is a collection of Pizzap AI Creating, co-owned and
              managed by PizzapDAO Members. Creators should use Pizzap AI
              creating tools to create, which currently support the creation of
              pictures, copywriting, and voice. PAI Space is a collection of
              Pizzap AI Creating, co-owned and managed by PizzapDAO Members.
              Creators should use Pizzap AI creating tools to create, which
              currently support the creation of pictures, copywriting, and
              voice. PAI Space is a collection of Pizzap AI Creating, co-owned
              and managed by PizzapDAO Members. Creators should use Pizzap AI
              creating tools to create, which currently support the creation of
              pictures, copywriting, and voice.
            </p>
            <p className="chain-li">
              <img src={require("../../assets/logo/8007736.png")} alt="" />
            </p>
          </div>
          <div className="vote-box">
            <p>
              <IconFont type="icon-a-zu1441" />
              {info.votes < 1 ? info.votes : addCommasToNumber(info.votes)}
              <span className="w-text">PNFT</span>
            </p>
            <p>Total Votes</p>
          </div>
          <div className="oper-box">
            <Button
              type="primary"
              onClick={() => {
                setVoteModal(true);
              }}
            >
              Vote
            </Button>
            <Button
              type="default"
              onClick={() => {
                const windowName = "newWindow";
                const windowFeatures = "width=800,height=600,top=100,left=100";
                const url = `https://test.pizzap.io/#/hackthon/${searchParams.id}/${searchParams.min}/${searchParams.chain}?referrer=${
                  state.address
                }`;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    "Alex share"
                  )}&url=${encodeURIComponent(url)}`,
                  windowName,
                  windowFeatures
                );
              }}
            >
              Share&Earn
              <IconFont type="icon-arrow-up-right" />
            </Button>
          </div>
        </div>
      </div>
      <VoteModal
        hackathon_id={info.hackathon_id}
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
