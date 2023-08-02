import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import CardItem from "../market/components/item.card";
import { Button, Spin } from 'antd'
import { NFTOwnerService } from '../../request/api'
import { NFTItem } from "../../utils/types";
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
    const [total, setTotal] = useState<number>(1);
    const [itemList, setItemList] = useState<NFTItem[]>([])
    const { queryOwner } = useContract();
    const [nowLength, setNowLength] = useState<number>(0);
    const { state } = useContext(PNft);
    const [otherBg, setOtherBG] = useState<string>('1');
    const [loadingBg, setLoadingBg] = useState<boolean>(true);
    //On Sle
    const saleListFN = async (_page?: number) => {
        setLoading(true);
        const result = await NFTOwnerService({
            chain_id:"8007736",
            address: state.owner_address,
            page_size: 10,
            page_num: _page ? _page : page
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
        setList(page > 1 ? [...list, ...filter] : filter);
        setNowLength(page > 1 ? [...list, ...filter].length : filter.length)
    };
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setPage(page + 1)
        setLoading(true);
        saleListFN()
    };
    const itemQuery = async () => {
        setLoading(true);
        setTotal(1);
        const result = await queryOwner();
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
            setNowLength([...now].length)
        });
        setLoading(false);
    }
    useEffect(() => {
        setTotal(1);
        setPage(1);
        loadMoreData();
        if (state.owner_address === state.address) {
            saleListFN(1);
        }
    }, [state.owner_address]);
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
        setNowLength(0);
        setTotal(1);
        _type === 0 ? saleListFN(1) : itemQuery();
    };
    const calsBG = () => {
        const bol = state.owner_address === state.address;
        const inner = state.account.bgimage_url ? state.account.bgimage_url : require('../../assets/images/test_bg.png');
        const out = otherBg ? otherBg : require('../../assets/images/test_bg.png');
        return bol ? inner : out
    }
    return (
        <div className="owner-view">
            <MaskCard />
            <div className="up-mask">
                <div className="owner-bg">
                    <img src={calsBG()} onLoad={() => {
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
                                {
                                    (activeTop === 0 ? list : itemList).map((item: NFTItem, index: number) => {
                                        return (
                                            <CardItem key={index} item={item} uploadSell={() => {
                                                setList([]);
                                                setLoading(true);
                                                setTotal(1);
                                                itemQuery();
                                            }} upload={() => {
                                                setItemList([]);
                                                setLoading(true);
                                                setTotal(1);
                                                itemQuery();
                                            }} />
                                        )
                                    })
                                }
                            </div>
                            {nowLength === total && <p className="has-no-more">
                                No More
                            </p>}
                            {nowLength < total && !loading && <p className="load-more">
                                <Button type="primary" onClick={loadMoreData}>Load More</Button>
                            </p>}
                            {loading && <Spin size="large" />}
                        </div>
                    </div>
                    {/* </Affix> */}
                </div>
            </div>

        </div>
    )
};

export default OwnerNFTSView;