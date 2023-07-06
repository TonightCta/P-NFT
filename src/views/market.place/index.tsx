import { ReactElement, ReactNode, useState } from "react";
import './index.scss'
import { useNavigate } from "react-router-dom";
import { Affix, Divider, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import CardItem from "../market/components/item.card";
import { NFTMarketService } from "../../request/api";
import { NFTItem } from "../../utils/types";

interface Cate {
    img: string,
    name: string,
    id: string | number,
    icon: string,
    show: boolean,
}
const cateList: Cate[] = [
    {
        img: require('../../assets/images/market_item_bg.png'),
        name: 'BabyBunny',
        id: 1,
        icon: require('../../assets/images/favicon.png'),
        show: true
    },
    {
        img: '',
        name: 'BabyBunny',
        id: 1,
        icon: '',
        show: false
    },
    {
        img: '',
        name: 'BabyBunny',
        id: 1,
        icon: '',
        show: false
    },
    {
        img: '',
        name: 'BabyBunny',
        id: 1,
        icon: '',
        show: false
    },
];
const MarketPlaceView = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [list, setList] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const marketListFN = async () => {
        const result = await NFTMarketService({
            chain_id: '8007736',
            page_size: 10,
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
        }
        const filter = data.data.item.map((item: any) => {
            return item = {
                ...item,
                load: true
            }
        });
        setList(page > 1 ? [...list, ...filter] : filter);
    }
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        marketListFN();
    };
    return (
        <div className="market-place-view" ref={setContainer} id="marketPlaceList">
            <p className="place-title">Explore Collections</p>
            <div className="cate-list">
                <ul>
                    {
                        cateList.map((item: Cate, index: number): ReactElement => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate('/market')
                                }}>
                                    <div className="banner-box">
                                        <img src={item.img} alt="" />
                                    </div>
                                    <p className={`${!item.show ? 'need-left' : ''}`}>{item.name}</p>
                                    <div className="icon-box">
                                        <img src={item.icon} alt="" />
                                    </div>
                                    {!item.show && <div className="coming-mask">
                                        <p>Coming Soon</p>
                                    </div>}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <p className="place-title">Discover</p>
            <div className="discover-card">
                <Affix offsetTop={100} onChange={(affixed) => console.log(affixed)} target={() => container}>
                    <div className="filter-box">
                        <ul>

                            {
                                ['Activities', 'Items'].map((item: string, index: number): ReactElement => {
                                    return (
                                        <li key={index} className={`${activeTab === index ? 'active-tab' : ''}`} onClick={() => {
                                            setActiveTab(index);
                                        }}>
                                            <span>{item}</span>
                                            <p></p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <input type="text" placeholder="Search" />
                    </div>
                </Affix>
                <div className="data-list">
                    <InfiniteScroll
                        key={list.length}
                        dataLength={list.length}
                        next={loadMoreData}
                        hasMore={list.length < total}
                        loader={<div className="loading-box"><Spin /><p>Loading...</p></div>}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="marketPlaceList"
                    >
                        <div className="list-item" >
                            {
                                list.map((item: NFTItem, index: number) => {
                                    return (
                                        <CardItem key={index} item={item} />
                                    )
                                })
                            }
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
};

export default MarketPlaceView;