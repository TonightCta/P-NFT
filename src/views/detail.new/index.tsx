import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { PNft } from "../../App";
import { Button, Image, Spin } from "antd";
import "./index.scss";
import IconFont from "../../utils/icon";
import MsgCard from "./components/msg.card";
import TradeHistory from "./components/trade.history";
import FooterNew from "../screen.new/components/footer.new";
import { NFTInfo, CollectionInfo } from "../../request/api";
import { web3 } from "../../utils/types";
import BuyNFTsModal from "../detail/components/buy.nft";
import { useNavigate, useParams } from "react-router-dom";
import { useSwitchChain } from "../../hooks/chain";
import {
  FilterAddress,
  FilterAddressToChain,
  FilterTokenInfo,
} from "../../utils";

interface Info {
  order_id: string;
  file_name: string;
  token_id: number;
  seller_name: string;
  seller_avatar_url: string;
  contract_address: string;
  price: string;
  file_description: string;
  collection_id: number;
  seller: string;
  pay_currency_name: string;
  cateory_name: string;
  labels: string[];
}

interface CollInfo {
  collection_description: string;
  logo_url: string;
  collection_name: string;
}

const DetailNewView = (): ReactElement<ReactNode> => {
  const { state } = useContext(PNft);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgLoad, setImgLoad] = useState<boolean>(true);
  const { switchC } = useSwitchChain();
  const [collInfo, setCollInfo] = useState<CollInfo>();
  const searchParams = useParams();
  const [player, setPlayer] = useState<any>();
  const [playF, setPlay] = useState<boolean>(false);
  const navigate = useNavigate();
  const [info, setInfo] = useState<Info | any>({
    price: "0",
  });
  const [takeVisible, setTakeVisible] = useState<boolean>(false);
  const getInfo = async () => {
    setLoading(true);
    const result = await NFTInfo({
      chain_id: FilterAddressToChain(searchParams.chain as string).chain_id,
      contract_address: searchParams.address,
      token_id: +(searchParams.tokenid as string),
    });
    setLoading(false);
    const { data } = result;
    setInfo(data);
    const cc = await CollectionInfo({
      collection_id: data.collection_id,
      chain_id: "1",
      contract_address: searchParams.address,
    });
    setCollInfo(cc.data);
  };
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <div className="detail-new-view">
      {loading ? (
        <div className="loading-box">
          <Spin size="large" />
        </div>
      ) : (
        <div className="detail-inner">
          <div className="coll-msg coll-msg-mobile">
            <IconFont
              type="icon-fanhuijiantou"
              onClick={() => {
                window.history.back();
              }}
            />
            <img src={collInfo?.logo_url} alt="" />
            <p>{collInfo?.collection_name}</p>
          </div>
          <div className="first-screen">
            <div className="left-nft">
              {imgLoad && (
                <div className="loading-box-public">
                  <Spin size="large" />
                </div>
              )}
              <Image
                onLoad={() => {
                  setImgLoad(false);
                }}
                src={info?.image_url}
              />
              {info.voice_url && (
                <div
                  className="play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (playF) {
                      player.pause();
                      setPlay(false);
                      setPlayer(null);
                      return;
                    }
                    const play = document.createElement("audio");
                    setPlayer(play);
                    play.src = info.voice_url;
                    play.loop = false;
                    play.play();
                    setPlay(true);
                  }}
                >
                  {playF ? (
                    <IconFont type="icon-tingzhi" />
                  ) : (
                    <IconFont type="icon-play-fill" />
                  )}
                </div>
              )}
            </div>
            <div className="right-msg">
              <div className="coll-msg">
                <IconFont
                  type="icon-fanhuijiantou"
                  onClick={() => {
                    window.history.back();
                  }}
                />
                <img src={collInfo?.logo_url} alt="" />
                <p>{collInfo?.collection_name}</p>
              </div>
              <p className="nft-name">
                {info?.file_name}&nbsp;#{info?.token_id}
              </p>
              <div
                className="owner-msg"
                onClick={() => {
                  navigate(`/user/${info.seller}`);
                }}
              >
                <img
                  src={
                    info?.seller_avatar_url
                      ? info?.seller_avatar_url
                      : info?.minter_avatar_url
                  }
                  alt=""
                />
                <p>
                  Owner
                  <span>
                    {info?.seller_name ? info?.seller_name : info?.minter_name}
                  </span>
                </p>
              </div>
              <div className="labels-msg">
                <p>
                  <IconFont type="icon-fenlei" />
                  {info?.cateory_name}
                </p>
                <p>
                  <IconFont type="icon-biaoqian" />
                  {info?.labels?.join("/")}
                </p>
              </div>
              {info?.is_onsale && state.address !== info.seller && (
                <div className="price-msg">
                  <p className="msg-title">Current price</p>
                  <div className="price-text">
                    <img
                      src={
                        FilterTokenInfo(info?.pay_currency_name as string).logo
                      }
                      alt=""
                    />
                    {info?.price && (
                      <p>
                        {web3.utils.fromWei(info?.price as string, "ether")}
                      </p>
                    )}
                    <p>{info.pay_currency_name}</p>
                  </div>
                  <p className="buy-btn">
                    {state.address?.toUpperCase() !==
                      info?.seller.toUpperCase() && (
                      <Button
                        type="primary"
                        onClick={async () => {
                          const switc: any = await switchC(
                            +(state.chain as string)
                          );
                          if (switc?.code) return;
                          setTakeVisible(true);
                        }}
                      >
                        <IconFont type="icon-gouwuche1_shopping-cart-one" />
                        Buy now
                      </Button>
                    )}
                  </p>
                </div>
              )}
              <div className="nft-info-msg public-msg-s">
                <p className="msg-title">
                  <IconFont type="icon-detail" />
                  Details
                </p>
                <ul>
                  <li>
                    <p>Contract</p>
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(
                          `https://piscan.plian.org/address/${info?.contract_address}?chain=1`
                        );
                      }}
                    >
                      {info?.contract_address}
                    </p>
                  </li>
                  <li>
                    <p>Token ID</p>
                    <p>{info?.token_id}</p>
                  </li>
                  <li>
                    <p>Blockchain</p>
                    {info.chain_id && (
                      <p>{FilterAddress(info.chain_id).chain_name}</p>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <MsgCard
            about={collInfo?.collection_description as string}
            description={info!.file_description}
          />
          <TradeHistory
            price={info.price}
            pay_currency_name="PI"
            image_minio_url={info.image_url}
            tokenID={info!.token_id}
            address={info!.contract_address}
          />
          <FooterNew />
          <BuyNFTsModal
            visible={takeVisible}
            closeModal={(val: boolean) => {
              setTakeVisible(val);
            }}
            upRefresh={() => {
              getInfo();
            }}
            item={info}
          />
        </div>
      )}
    </div>
  );
};

export default DetailNewView;
