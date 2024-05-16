import { ReactElement, ReactNode, useEffect, useState } from "react";
import "./index.scss";
import FooterNew from "../screen.new/components/footer.new";
import IconFont from "../../utils/icon";
import { Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import MintModal from "./components/mint.modal";
import { CollectionInfo } from "../../request/api";
import { useParams } from "react-router-dom";
import { useContract } from "../../utils/contract";

export interface Info {
  category_name: string;
  audio_url: string;
  bg_image_url: string;
  chain_id: string;
  collection_description: string;
  collection_name: string;
  contract_address: string;
  contract_type: string;
  creator_name: string;
  current_supply: number;
  logo_url: string;
  pay_token_name: string;
  poster_url: string;
  total_supply: number;
  website_link:string,
  twitter_link:string,
  medium_link:string,
  discord_link:string,
  tg_link:string
}

const LaunchpadDetailView = (): ReactElement<ReactNode> => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false);
  const searchParams = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<Info>({
    category_name: "",
    audio_url: "",
    bg_image_url: "",
    chain_id: "",
    collection_description: "",
    collection_name: "",
    contract_address: "",
    contract_type: "",
    creator_name: "",
    current_supply: 0,
    logo_url: "",
    pay_token_name: "",
    poster_url: "",
    total_supply: 0,
    website_link:'',
    medium_link:'',
    tg_link:'',
    discord_link:'',
    twitter_link:''
  });
  const [chainMsg, setChainMsg] = useState<{
    price: number | string;
    total: number | string;
    current: number | string;
  }>({
    price: "",
    total: "",
    current: "",
  });
  const { QueryNFTMsg } = useContract();
  const getInfo = async () => {
    const result = await CollectionInfo({
      collection_id: searchParams.id,
      chain_id: searchParams.chain,
      contract_address: searchParams.address,
    });
    const { data } = result;
    setInfo(data);
    getPrice(data.contract_address);
  };
  const getPrice = async (_address: string) => {
    const { price, total, current } = await QueryNFTMsg(_address);
    setChainMsg({
      price: price,
      total: total,
      current: current,
    });
  };
  useEffect(() => {
    getInfo();
  }, []);
  const website = (_url: string) => {
    if(!_url){
      message.error('Link not set');
      return
    }
    window.open(_url, "_blank");
  };
  return (
    <div className="launchpad-detail-view">
      <div className="mobile-show-msg">
        <div className="col-n-b">
          <IconFont
            type="icon-fanhuijiantou"
            onClick={() => {
              navigate("/launchpad");
            }}
          />
          <img src={info?.logo_url} alt="" />
          <p>Launchpad</p>
        </div>
        <p className="col-name">{info?.collection_name}</p>
        <div className="creator-msg">
          <img src={require("../../assets/images/test2.png")} alt="" />
          <div className="c-by">
            <p>Created by {info?.creator_name}</p>
            <p>{info?.total_supply}&nbsp;NFTs</p>
          </div>
        </div>
      </div>
      <div className="detail-inner">
        <div className="poster-box">
          {loading && <Spin size="large" />}
          <img
            src={info?.poster_url}
            onLoad={() => {
              setLoading(false);
            }}
            alt=""
          />
        </div>
        <div className="collection-msg">
          <div className="col-n-b">
            <IconFont
              type="icon-fanhuijiantou"
              onClick={() => {
                navigate("/launchpad");
              }}
            />
            <img src={info?.logo_url} alt="" />
            <p>Launchpad</p>
          </div>
          <p className="col-name">{info?.collection_name}</p>
          <div className="creator-msg">
            <img src={require("../../assets/images/test2.png")} alt="" />
            <div className="c-by">
              <p>Created by {info?.creator_name}</p>
              <p>{info?.total_supply}&nbsp;NFTs</p>
            </div>
          </div>
          <div className="outside-link">
            <ul>
              <li onClick={() => {website(info.website_link)}}>
                <IconFont type="icon-globe-simple-bold" />
              </li>
              <li onClick={() => {website(info.tg_link)}}>
                <IconFont type="icon-telegram-logo-bold" />,
              </li>
              <li onClick={() => {website(info.twitter_link)}}>
                <IconFont type="icon-twitter-logo-bold" />
              </li>
              <li onClick={() => {website(info.medium_link)}}>
                <IconFont type="icon-medium1" />
              </li>
              <li onClick={() => {website(info.discord_link)}}>
                <IconFont type="icon-discord-logo-bold" color="red" />
              </li>
            </ul>
          </div>
          <div className="mint-box">
            <div className="price-total">
              <div className="price total-public">
                <p>Mint Price</p>
                <div className="p-tag">
                  <img
                    src={require("../../assets/images/pi_logo.png")}
                    alt=""
                  />
                  {chainMsg.price ? chainMsg.price : <Spin />}&nbsp;
                </div>
              </div>
              <div className="total-public">
                <p>Tokens Minted</p>
                <div className="p-tag">
                  {chainMsg.current ? chainMsg.current : <Spin />}&nbsp;/&nbsp;
                  {chainMsg.total ? chainMsg.total : <Spin />}
                </div>
              </div>
            </div>
            <div className="mint-oper">
              <Button
                type="primary"
                onClick={() => {
                  setVisible(true);
                }}
              >
                Mint
              </Button>
            </div>
          </div>
          <div className="desc-box">
            <p className="desc-title">
              <IconFont type="icon-detail" />
              Description
            </p>
            <p className="desc-text">{info?.collection_description}</p>
          </div>
        </div>
      </div>
      <MintModal
        {...info}
        price={+chainMsg.price}
        visible={visible}
        uploadData={() => {
          getPrice(info.contract_address);
          setChainMsg({
            ...chainMsg,
            total: "",
            current: "",
          });
        }}
        onClose={(val: boolean) => {
          setVisible(val);
        }}
      />
      <FooterNew />
    </div>
  );
};

export default LaunchpadDetailView;
