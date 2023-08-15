import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import CardItem from "../market/components/item.card";
import { Pagination, Spin } from 'antd'
import { NFTOwnerService } from '../../request/api'
import { NFTItem, Type } from "../../utils/types";
import { useContract } from "../../utils/contract";
import axios from "axios";
import OwnerCard from "./components/owner.card";
import { SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MaskCard from "../../components/mask";
import { PNft } from "../../App";

const OwnerNFTSView = (): ReactElement<ReactNode> => {
    const [activeTop, setActiveTop] = useState<number>(0);
    const navigate = useNavigate();
    const [list, setList] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [itemList, setItemList] = useState<NFTItem[]>([])
    const { queryOwner } = useContract();
    const { state } = useContext(PNft);
    const [otherBg, setOtherBG] = useState<string>('1');
    const [loadingBg, setLoadingBg] = useState<boolean>(true);
    const { dispatch } = useContext(PNft);
    //On Sle
    const saleListFN = async () => {
        setLoading(true);
        const result = await NFTOwnerService({
            chain_id: process.env.REACT_APP_CHAIN,
            address: state.owner_address,
            page_size: 12,
            page_num: page
        });
        setLoading(false);
        const { status, data } = result;
        if (status !== 200) {
            return
        };
        setTotal(data.data.total)
        if (!data.data.item) {
            setList([]);
            return
        };
        const filter = data.data.item.map((item: any) => {
            return item = {
                ...item,
                load: true,
                off: true,
            }
        });
        setList(filter);
    };
    const loadMoreData = () => {
        saleListFN()
    };
    const itemQuery = async () => {
        setLoading(true);
        const result: any = await queryOwner();
        console.log(result)
        setTotal(result.length);
        const now: NFTItem[] = [];
        result.forEach(async (e: any) => {
            const detail = await axios.get(e.tokenURI);
            const params = {
                ...e,
                file_image_ipfs: detail.data.image,
                file_voice_ipfs: detail.data.external_url,
                token_id: +e.id,
                file_name: detail.data.name,
                load: true,
                play: false
            };
            now.push(params);
            setItemList([...now])
        });
        setLoading(false);
    }
    useEffect(() => {
        loadMoreData();
    }, [state.owner_address,page]);
    const selectTop = (_type: number) => {
        // switch (_type) {
        //     case 0:
        //         setChangeTabs(['Buy now', 'Ended'])
        //         break;
        //     case 1:
        //         setChangeTabs(['In Wallet', 'Favorites'])
        //         break;
        //     case 2:
        //         setChangeTabs(['Mine', 'Favorites'])
        //         break;
        //     default:
        //         setChangeTabs(['Buy now', 'Ended'])
        // };
        setActiveTop(_type);
        setList([]);
        setItemList([]);
        _type === 0 ? saleListFN() : itemQuery();
    };
    const calsBG = () => {
        const bol = state.owner_address === state.address;
        return bol ? state.account.bgimage_url : otherBg;
    }
    useEffect(() => {
        return () => {
            dispatch({
                type: Type.SET_OWNER_ADDRESS,
                payload: {
                    owner_address: ''
                }
            });
        }
    }, [])
    return (
        <div className="owner-view">
            <MaskCard />
            <div className="up-mask">
                <div className="owner-bg">
                    <img className={`${calsBG() ? '' : 'max-height'}`} src={calsBG() ? calsBG() : require('../../assets/images/test_bg.png')} onLoad={() => {
                        setLoadingBg(false)
                    }} alt="" />
                    {loadingBg && <div className="loading-bg">
                        <Spin size="large" />
                    </div>}
                </div>
                <div className="owner-inner">
                    <OwnerCard updateBG={(_url: string) => {
                        setOtherBG(_url);
                    }} />
                    <div className="inner-data">
                        {state.owner_address === state.address && <div className="set-btn" onClick={() => {
                            navigate('/profile')
                        }}>
                            <SettingOutlined />
                            <p>Setting</p>
                        </div>}
                        <div className="filter-box">
                            <div className="tabs">
                                <ul>
                                    {
                                        (state.owner_address === state.address ? ['On sale', 'Items'] : ['On sale']).map((item: string, index: number): ReactElement => {
                                            return (
                                                <li key={index} className={`${activeTop === index ? 'active-top' : ''}`} onClick={() => {
                                                    selectTop(index)
                                                }}>{item}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="search-box">
                                <input type="text" placeholder="Search" />
                            </div>
                        </div>
                        <div className="conponenst-gater" id="ownerView">
                            <div className="list-item" >
                                {loading && <div className="load-data-box">
                                    <Spin size="large" />
                                </div>}
                                {
                                    (activeTop === 0 ? list : itemList).map((item: NFTItem, index: number) => {
                                        return (
                                            <CardItem key={index} item={item} uploadSell={() => {
                                                setList([]);
                                                setPage(1);
                                                setLoading(true);
                                                saleListFN();
                                            }} upload={() => {
                                                setItemList([]);
                                                setLoading(true);
                                                itemQuery();
                                            }} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {
                            activeTop === 1 && !loading && <p>No more</p>
                        }
                        {
                            activeTop === 0 && total === 0 && !loading && <p>No more</p>
                        }
                        {activeTop === 0 && total > 0 && <div className="page-oper">
                            <Pagination defaultCurrent={1} pageSize={12} total={total} onChange={(page) => {
                                window.scrollTo({
                                    top: 220,
                                    behavior: 'smooth'
                                })
                                setPage(page)
                            }} />
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default OwnerNFTSView;