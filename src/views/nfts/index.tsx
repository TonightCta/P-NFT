import { ReactElement, ReactNode, useEffect, useState } from "react";
import './index.scss'
import { CopyOutlined, TwitterOutlined } from "@ant-design/icons";
import CardItem from "../market/components/item.card";
import { Affix, Divider, Spin } from 'antd'
import InfiniteScroll from "react-infinite-scroll-component";
import TabList from "../detail/components/tab.list";
import { NFTOwnerService } from '../../request/api'
import { NFTItem, ethereum } from "../../utils/types";
import { useContract } from "../../utils/contract";
import axios from "axios";
import { calsAddress } from "../../utils";

const OwnerNFTSView = (): ReactElement<ReactNode> => {
    // const [changeTabs, setChangeTabs] = useState<string[]>(['Buy now', 'Ended']);
    const [activeTop, setActiveTop] = useState<number>(0);
    // const [activeBot, setActiveBot] = useState<number>(0);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [list, setList] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(1);
    const [itemList,setItemList] = useState<NFTItem[]>([])
    const { queryOwner } = useContract();
    //On Sle
    const saleListFN = async (_page?: number) => {
        const result = await NFTOwnerService({
            address: ethereum.selectedAddress,
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
                price: ''
            }
        });
        setList(page > 1 ? [...list, ...filter] : filter);
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
                token_id: +e.id,
                file_name: detail.data.name,
                load: true,
            };
            now.push(params);
            setItemList([...now])
        });
    }
    useEffect(() => {
        loadMoreData();
    }, []);
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
        setTotal(1);
        _type === 0 ? saleListFN(1) : itemQuery();
    }
    return (
        <div className="owner-view" id="ownerView" ref={setContainer}>
            <div className="account-msg">
                <div className="avatar-box">
                    <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                </div>
                <div className="msg-box">
                    <p className="msg-large">{calsAddress(ethereum.selectedAddress)}</p>
                    <div className="outside-account">
                        <div className="address-text">
                            <p>{calsAddress(ethereum.selectedAddress)}</p>
                            <CopyOutlined />
                        </div>
                        <p className="outside-go">
                            <TwitterOutlined />
                        </p>
                    </div>
                </div>
            </div>
            <Affix offsetTop={0} target={() => container}>
                <div className="data-tabs">
                    <ul>
                        {
                            ['On sale', 'Items'].map((item: string, index: number): ReactElement => {
                                return (
                                    <li key={index} className={`${activeTop === index ? 'active-top' : ''}`} onClick={() => {
                                        selectTop(index)
                                    }}>{item}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </Affix>
            <div className="filter-box">
                {/* <div className="tabs">
                    <ul>
                        {
                            changeTabs.map((item: string, index: number): ReactElement => {
                                return (
                                    <li key={index} className={`${activeBot === index ? 'active-bot' : ''}`} onClick={() => {
                                        setActiveBot(index)
                                    }}>{item}</li>
                                )
                            })
                        }
                    </ul>
                </div> */}
                <div className="search-box">
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div className="conponenst-gater">
                {activeTop === 2
                    ? <TabList />
                    : <InfiniteScroll
                        key={activeTop === 0 ? list.length : itemList.length}
                        dataLength={activeTop === 0 ? list.length : itemList.length}
                        next={loadMoreData}
                        hasMore={(activeTop === 0 ? list.length : itemList.length) < total}
                        loader={<div className="loading-box"><Spin /><p>Loading...</p></div>}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="ownerView"
                    >
                        <div className="list-item" >
                            {
                                (activeTop === 0  ? list : itemList).map((item: NFTItem, index: number) => {
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
                                        // <li key={index}></li>
                                    )
                                })
                            }
                        </div>
                    </InfiniteScroll>}
            </div>
        </div>
    )
};

export default OwnerNFTSView;