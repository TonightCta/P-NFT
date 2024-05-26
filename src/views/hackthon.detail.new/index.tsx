import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import IconFont from "../../utils/icon";
import { Button } from "antd";
import "./index.scss";
import FooterNew from "../screen.new/components/footer.new";
import VoteModal from "../hackthon.detail/components/vote.modal";
import { PNft } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { HackathonInfo } from "../../request/api";

const HackthonDetailNewView = (): ReactElement<ReactNode> => {
  const [voteModal, setVoteModal] = useState<boolean>(false);
  const { state } = useContext(PNft);
  const searchParams = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState<any>();
  const getInfo = async () => {
    const result = await HackathonInfo({
      chain_id: "8007736",
      hackathon_item_id: searchParams.id ,
      page_size: 10,
      page_num: 1,
    });
    console.log(result);
    const { data } = result;
    setInfo(data);
  };
  useEffect(() => {
    getInfo();
  },[])
  return (
    <div className="hackthon-detail-new-view">
      <div className="detail-inner">
        <div className="left-nft">
          <img
            src={require("../../assets/images/test2.png")}
            alt=""
          />
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
              <p className="address">
                0xbD19c55cEAED0bF7b71CC939316971E8C640730E
              </p>
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
              20,000<span className="w-text">PNFT</span>
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
                const url = `https://test.pizzap.io/#/hackthon/1?referrer=${
                  state.address
                }&id=${1}`;
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
        id={info.hackathon_id}
        min={info.min_voting_amount}
        token_id={info.token_id}
        visible={voteModal}
        onClose={(val: boolean) => {
          setVoteModal(val);
        }}
      />
      <FooterNew />
    </div>
  );
};

export default HackthonDetailNewView;
