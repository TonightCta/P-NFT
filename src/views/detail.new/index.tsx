import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { PNft } from "../../App";
import { Button, Spin } from "antd";
import './index.scss'
import IconFont from "../../utils/icon";
import MsgCard from "./components/msg.card";
import TradeHistory from "./components/trade.history";
import FooterNew from "../screen.new/components/footer.new";
import { NFTInfo, CollectionInfo } from '../../request/api'
import { Type, web3 } from "../../utils/types";
import BuyNFTsModal from "../detail/components/buy.nft";
import { useNavigate } from "react-router-dom";
import { PlianContractAddress721Main } from "../../utils/source";

interface Info {
    image_minio_url: string,
    order_id: string,
    file_name: string,
    token_id: number,
    seller_name: string,
    seller_avatar_url: string,
    contract_address: string,
    price: string,
    file_description: string,
    collection_id: number,
    seller: string,
    pay_currency_name:string,
    cateory_name:string,
    labels:string[]
}

interface CollInfo {
    collection_description: string,
    collection_name: string,
    logo_minio_url: string
}

const DetailNewView = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(PNft);
    const [loading, setLoading] = useState<boolean>(false);
    const [imgLoad, setImgLoad] = useState<boolean>(true);
    const [collInfo, setCollInfo] = useState<CollInfo>()
    const navigate = useNavigate();
    const [info, setInfo] = useState<Info | any>({
        price: '0'
    });
    const [takeVisible, setTakeVisible] = useState<boolean>(false);
    const getInfo = async () => {
        setLoading(true);
        const result = await NFTInfo({
            fid: +(state.info_id as string),
        });
        setLoading(false);
        const { data } = result;
        setInfo(data);
        const cc = await CollectionInfo({
            collection_id: data.collection_id,
            chain_id: '1',
            contract_address: PlianContractAddress721Main
        });
        setCollInfo(cc.data)
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
                            {imgLoad && <Spin size="large" />}
                            <img onLoad={() => { setImgLoad(false) }} src={info?.image_minio_url} alt="" />
                        </div>
                        <div className="right-msg">
                            <div className="coll-msg">
                                <IconFont type="icon-fanhuijiantou" onClick={() => {
                                    window.history.back()
                                }} />
                                <img src={collInfo?.logo_minio_url} alt="" />
                                <p>{collInfo?.collection_name}</p>
                            </div>
                            <p className="nft-name">{info?.file_name}&nbsp;#{info?.token_id}</p>
                            <div className="owner-msg" onClick={() => {
                                dispatch({
                                    type: Type.SET_OWNER_ADDRESS,
                                    payload: {
                                        owner_address: info.seller
                                    }
                                });
                                navigate('/owner')
                            }}>
                                <img src={info?.seller_avatar_url ? info?.seller_avatar_url : info?.minter_avatar_url} alt="" />
                                <p>Owner<span>{info?.seller_name ? info?.seller_name : info?.minter_name}</span></p>
                            </div>
                            <div className="labels-msg">
                                <p>
                                    <IconFont type="icon-biaoqian" />
                                    {info?.labels?.join('/')}
                                </p>
                                <p>
                                    <IconFont type="icon-fenlei" />
                                    {info?.cateory_name}
                                </p>
                            </div>
                            {info?.is_onsale && state.address !== info.seller && <div className="price-msg">
                                <p className="msg-title">Current price</p>
                                <div className="price-text">
                                    <img src={info?.pay_currency_name === 'PI' ? require('../../assets/images/pi_logo.png') : require('../../assets/new/eth_logo.png')} alt="" />
                                    {info?.price && <p>{web3.utils.fromWei(info?.price as string, 'ether')}</p>}
                                    <p>Price</p>
                                </div>
                                <p className="buy-btn">
                                    <Button type="primary" onClick={() => {
                                        setTakeVisible(true);
                                    }}>
                                        <IconFont type="icon-gouwuche1_shopping-cart-one" />
                                        Buy now
                                    </Button>
                                </p>
                            </div>}
                            <div className="nft-info-msg public-msg-s">
                                <p className="msg-title">
                                    <IconFont type="icon-detail" />
                                    Details
                                </p>
                                <ul>
                                    <li>
                                        <p>Contract</p>
                                        <p>{info?.contract_address}</p>
                                    </li>
                                    <li>
                                        <p>Token ID</p>
                                        <p>{info?.token_id}</p>
                                    </li>
                                    <li>
                                        <p>Blockchain</p>
                                        <p>Plian Mainnet Subcha</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <MsgCard about={collInfo?.collection_description as string} description={info!.file_description} />
                    <TradeHistory price={info.price} paymod="PI" image_minio_url={info.image_minio_url} tokenID={info!.token_id} address={info!.contract_address} />
                    <FooterNew />
                    <BuyNFTsModal visible={takeVisible} closeModal={(val: boolean) => {
                        setTakeVisible(val)
                    }} upRefresh={() => {
                        getInfo();
                    }} item={info} />
                </div>}
        </div>
    )
};


export default DetailNewView;