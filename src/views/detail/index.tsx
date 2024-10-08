import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import TabList from "./components/tab.list";
import { Button, Spin, message } from "antd";
import VerifyModal from "./components/verify.address";
import { LAND } from "../../utils/contract";
import { PNft } from "../../App";
import { web3 } from "../../utils/types";
import { calsAddress } from "../../utils";
import IconFont from "../../utils/icon";
import { CaretRightOutlined } from "@ant-design/icons";
import { NFTInfoService, ProfileService } from '../../request/api'
import MaskCard from "../../components/mask";
import { useNavigate } from "react-router-dom";
import { flag } from "../../utils/source";
import BuyNFTsModal from "./components/buy.nft";
import { useMetamask } from "../../utils/connect/metamask";

const DetailView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const [item, setItem] = useState<any>(state.card);
    const [virifyVisible, setVerifyVisible] = useState<boolean>(false);
    const [takeVisible, setTakeVisible] = useState<boolean>(false);
    const [imgLoad, setImgLoad] = useState<boolean>(true);
    const [player, setPlayer] = useState<any>();
    const [ownerItem, setOwnerItem] = useState<any>({});
    const { connectMetamask } = useMetamask();
    const navigate = useNavigate();
    const getNFTInfo = async () => {
        const result = await NFTInfoService({
            chain_id: state.chain,
            sender: state.address,
            order_id: item.order_id
        });
        setItem({
            ...result.data,
            play: false
        });
        queryOwnerFN();
    };

    useEffect(() => {
        getNFTInfo();
    }, []);
    const queryOwnerFN = async () => {
        const result = await ProfileService({
            user_address: item.seller
        });
        setOwnerItem(result.data)
    }
    return (
        <div className="detail-view">
            <MaskCard />
            <div className="up-mask">
                <div className="nft-msg">
                    <div className="left-nft-box">
                        <img src={item.file_url} onLoad={() => {
                            setImgLoad(false);
                        }} alt="" />
                        {imgLoad && <div className="load-box">
                            <Spin size="large" />
                        </div>}
                        <div className="audio-box">
                            <div className="play-btn" onClick={(e) => {
                                e.stopPropagation();
                                if (!item.voice_url) {
                                    message.error('Failed')
                                    return
                                };
                                if (item.play) {
                                    player.pause();
                                    setItem({
                                        ...item,
                                        play: false
                                    });
                                    setPlayer(null);
                                    return
                                }
                                const play = document.createElement('audio');
                                setPlayer(play)
                                play.src = item.voice_url;
                                play.loop = false;
                                play.play();
                                setItem({
                                    ...item,
                                    play: true
                                });
                            }}>
                                {item.play ? <IconFont type="icon-tingzhi" /> : <CaretRightOutlined />}
                            </div>
                        </div>
                    </div>
                    <div className="right-nft-msg">
                        <p className="msg-name">
                            {/* <img src={require('../../assets/images/favicon.png')} alt="" /> */}
                            PAI SPACE
                        </p>
                        <p className="nft-num">{item.file_name}&nbsp;#{item.token_id}</p>
                        <p className="nft-remark public-remark" onClick={() => {
                            // dispatch({
                            //     type: Type.SET_OWNER_ADDRESS,
                            //     payload: {
                            //         owner_address: item.seller
                            //     }
                            // });
                            navigate(`/user/${item.minter}`)
                            // navigate('/owner')
                        }}>
                            <img src={ownerItem.avatar_url} alt="" />
                            Owner<span>{ownerItem.user_name}</span>
                        </p>
                        <p className="create-msg public-remark">
                            <img src={require('../../assets/images/favicon.png')} alt="" />
                            Creator<span>Pizzap</span>
                        </p>
                        <div className="edit-box">
                            <div className="inner-top">
                                <div className="price-msg">
                                    <p>Current price</p>
                                    <p><span>{Number(web3.utils.fromWei(item.price, 'ether')).toFixed(2)}&nbsp;{item.pay_currency_name}</span></p>
                                </div>
                                <div className="btn-oper">
                                    <p>{state.address?.toUpperCase() !== item.seller.toUpperCase()}</p>
                                    {state.address?.toUpperCase() !== item.seller.toUpperCase() && <Button onClick={async () => {
                                        if (!state.address) {
                                            await connectMetamask()
                                        };
                                        setTakeVisible(true)
                                    }}>
                                        <IconFont type="icon-gouwuche1_shopping-cart-one" />
                                        Buy now
                                    </Button>}
                                </div>
                            </div>
                        </div>
                        <div className="msg-switch">
                            {/* <div className="msg-tabs">
                                <ul>
                                    {
                                        ['Attributes', 'Info'].map((item: string, index: number): ReactElement => {
                                            return (
                                                <li key={index} className={`${active === index ? 'active-tab-msg' : ''}`} onClick={() => {
                                                    setActive(index)
                                                }}>{item}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div> */}
                            <ul className="msg-list">
                                <li>
                                    <p>CONTRACT</p>
                                    <p>{flag ? calsAddress(item.contract_address) : item.contract_address}</p>
                                </li>
                                <li>
                                    <p>TOKEN ID</p>
                                    <p>{item.token_id}</p>
                                </li>
                                <li>
                                    <p>BLOCKCHAIN</p>
                                    <p>{LAND === 'taiko' ? 'Taiko Grimsvotn L2' : 'Plian Mainnet Subchain 1'}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="list-filter">
                    <div className="tab-btn">
                        <ul>
                            <li>Activities</li>
                        </ul>
                    </div>
                    <div className="search-inp">
                        <input type="text" placeholder="Search" />
                    </div>
                </div>
                <TabList />
            </div>

            {/* 验证地址 */}
            <VerifyModal visible={virifyVisible} closeModal={(val: boolean) => {
                setVerifyVisible(val)
            }} />
            {/* 购买NFT */}
            <BuyNFTsModal visible={takeVisible} closeModal={(val: boolean) => {
                setTakeVisible(val)
            }} upRefresh={() => {
                getNFTInfo();
            }} item={item} />
        </div>
    )
};

export default DetailView;