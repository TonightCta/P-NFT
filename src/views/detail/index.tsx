import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import TabList from "./components/tab.list";
import { Button, Spin, message } from "antd";
import VerifyModal from "./components/verify.address";
import { LAND, useContract } from "../../utils/contract";
import { PNft } from "../../App";
import { Type, web3 } from "../../utils/types";
import { calsAddress } from "../../utils";
import { NFTBuyService } from "../../request/api";
import IconFont from "../../utils/icon";
import { CaretRightOutlined } from "@ant-design/icons";
import { useMetamask } from "../../utils/metamask";
import { NFTInfoService, ProfileService } from '../../request/api'
import MaskCard from "../../components/mask";
import { useNavigate } from "react-router-dom";
import { flag } from "../../utils/source";
import { useSwitchChain } from "../../hooks/chain";

const DetailView = (): ReactElement<ReactNode> => {
    const { switchC } = useSwitchChain();
    const { connectMetamask } = useMetamask();
    const { buy } = useContract();
    const { state } = useContext(PNft);
    const [item, setItem] = useState<any>(state.card);
    const [virifyVisible, setVerifyVisible] = useState<boolean>(false);
    const [imgLoad, setImgLoad] = useState<boolean>(true);
    const [wait, setWait] = useState<boolean>(false);
    const [player, setPlayer] = useState<any>();
    const [ownerItem, setOwnerItem] = useState<any>({});
    const { dispatch } = useContext(PNft);
    const navigate = useNavigate();
    const getNFTInfo = async () => {
        const result = await NFTInfoService({
            chain_id: process.env.REACT_APP_CHAIN,
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
    const buyNFTFN = async () => {
        await switchC(Number(process.env.REACT_APP_CHAIN))
        if (!state.address) {
            await connectMetamask();
            return
        }
        setWait(true)
        const result: any = await buy(item.order_id, item.price,item.paymod);
        setWait(false)
        // console.log(result);
        if (!result || result.message) {
            return
        }
        const maker = await NFTBuyService({
            chain_id: process.env.REACT_APP_CHAIN,
            sender: state.address,
            tx_hash: result['transactionHash']
        });
        const { status } = maker;
        if (status !== 200) {
            message.error(maker.message);
            return
        };
        message.success('Successfully Purchase!');
    }
    return (
        <div className="detail-view">
            <MaskCard />
            <div className="up-mask">
                <div className="nft-msg">
                    <div className="left-nft-box">
                        <img src={item.file_image_ipfs} onLoad={() => {
                            setImgLoad(false);
                        }} alt="" />
                        {imgLoad && <div className="load-box">
                            <Spin size="large" />
                        </div>}
                        <div className="audio-box">
                            <div className="play-btn" onClick={(e) => {
                                e.stopPropagation();
                                if (!item.file_voice_ipfs) {
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
                                play.src = item.file_voice_ipfs;
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
                            dispatch({
                                type: Type.SET_OWNER_ADDRESS,
                                payload: {
                                    owner_address: item.seller
                                }
                            });
                            navigate('/owner')
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
                                    <p><span>{Number(web3.utils.fromWei(item.price, 'ether')).toFixed(2)}&nbsp;{item.paymod}</span></p>
                                </div>
                                <div className="btn-oper">
                                    {state.address?.toUpperCase() !== item.seller.toUpperCase() && <Button onClick={buyNFTFN} loading={wait} disabled={wait}>
                                        <IconFont type="icon-gouwuche1_shopping-cart-one"/>
                                        Buy now
                                    </Button>}
                                    {/* <p><span>Cancel</span> the listing</p> */}
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
                                    <p>{LAND ==='taiko' ? 'Taiko Grimsvotn L2' : 'Plian Mainnet Subchain 1'}</p>
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
        </div>
    )
};

export default DetailView;