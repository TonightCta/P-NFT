import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { PNft } from "../../App";
import { Button, Spin } from "antd";
import './index.scss'
import IconFont from "../../utils/icon";
import MsgCard from "./components/msg.card";
import TradeHistory from "./components/trade.history";
import FooterNew from "../screen.new/components/footer.new";
import { NFTInfo } from '../../request/api'

const DetailNewView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const [loading, setLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<{}>({});
    const getInfo = async () => {
        setLoading(true);
        const result = await NFTInfo({
            fid: state.info_id,
        });
        setLoading(false);
        console.log(result);
    }
    useEffect(() => {
        getInfo();
    }, [])
    return (
        <div className="detail-new-view">
            {loading
                ? <div className="loading-box">
                    <Spin size="large" />
                </div>
                : <div className="detail-inner">
                    <div className="first-screen">
                        <div className="left-nft">
                            <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                        <div className="right-msg">
                            <div className="coll-msg">
                                <IconFont type="icon-fanhuijiantou" />
                                <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                                <p>Pai Space</p>
                            </div>
                            <p className="nft-name">A fashion girl&nbsp;#003</p>
                            <div className="owner-msg">
                                <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                                <p>Owner<span>Alex</span></p>
                            </div>
                            <div className="labels-msg">
                                <p>
                                    <IconFont type="icon-biaoqian" />
                                    AI/character/Voice
                                </p>
                                <p>
                                    <IconFont type="icon-fenlei" />
                                    Art
                                </p>
                            </div>
                            <div className="price-msg">
                                <p className="msg-title">Current price</p>
                                <div className="price-text">
                                    <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                                    <p>2.515</p>
                                    <p>Price</p>
                                </div>
                                <p className="buy-btn">
                                    <Button type="primary">
                                        <IconFont type="icon-gouwuche1_shopping-cart-one" />
                                        Buy now
                                    </Button>
                                </p>
                            </div>
                            <div className="nft-info-msg public-msg-s">
                                <p className="msg-title">
                                    <IconFont type="icon-detail" />
                                    Details
                                </p>
                                <ul>
                                    <li>
                                        <p>Contract</p>
                                        <p>0xB368...B5C8</p>
                                    </li>
                                    <li>
                                        <p>Token ID</p>
                                        <p>11</p>
                                    </li>
                                    <li>
                                        <p>Blockchain</p>
                                        <p>Plian Mainnet Subcha</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <MsgCard />
                    <TradeHistory />
                    <FooterNew />
                </div>}
        </div>
    )
};


export default DetailNewView;