import { ReactElement, ReactNode, useEffect, useState } from "react";
import './index.scss'
import CardItem from "./components/item.card";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from "antd";
import { NFTMarketService } from '../../request/api'
import { NFTItem } from "../../utils/types";
// import { NFTs } from "../../utils/source";
import IconFont from "../../utils/icon";
import EmptyCard from "../../components/empty";
import MaskCard from "../../components/mask";

interface Community {
    icon: ReactNode,
    url: string
}

// interface Total {
//     name: string,
//     count: number
// }

// const CountSource: Total[] = [
//     {
//         name: 'TRADED',
//         count: 890
//     },
//     {
//         name: 'PLAYERS',
//         count: 890
//     },
//     {
//         name: 'LISTED',
//         count: 890
//     },
//     {
//         name: 'VOL(BTC)',
//         count: 890
//     },
//     {
//         name: 'FLOOR(BTC)',
//         count: 2.5
//     },
// ];
const MarketIndex = (): ReactElement<ReactNode> => {
    const communityList: Community[] = [
        {
            icon: <IconFont type="icon-globe-simple-bold" />,
            url: ''
        },
        {
            icon: <IconFont type="icon-telegram-logo-bold" />,
            url: ''
        },
        {
            icon: <IconFont type="icon-twitter-logo-bold" />,
            url: ''
        },
        {
            icon: <IconFont type="icon-medium" />,
            url: ''
        },
        {
            icon: <IconFont type="icon-discord-logo-bold" color="red" />,
            url: ''
        }
    ];
    // const [container, setContainer] = useState<HTMLDivElement | null>(null);
    // const [countList, setCountList] = useState<Total[]>(CountSource);
    // const [activeTab, setActiveTab] = useState<number>(0);
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
        console.log(result);
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
                load: true,
                play: false
            }
        });
        setList(page > 1 ? [...list, ...filter] : filter);
    }
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setPage(page + 1)
        setLoading(true);
        marketListFN()
    };
    useEffect(() => {
        loadMoreData();
    }, []);
    return (
        <div className="market-index" id="dataList">
            <MaskCard />
            <div className="up-mask">
                <div className="top-bg">
                    <img src={require('../../assets/images/babay_bg.png')} alt="" />
                </div>
                <div className="com-msg">
                    <div className="com-icon">
                        <img src={require('../../assets/nfts/s_1.png')} alt="" />
                    </div>
                    <div className="com-right-msg">
                        <div className="top-share">
                            <p className="market-title">Baby Bunny</p>
                            {/* 社区分享 */}
                            <div className="com-list">
                                <ul>
                                    {
                                        communityList.map((item: Community, index: number): ReactElement => {
                                            return (
                                                <li key={index}>
                                                    {item.icon}
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <p className="pool-remark">
                            Baby Bunny Club is a collection of 10,000 Baby Bunny NFTs—unique digital collectibles launched by PizzapDAO.
                            Your Baby Bunny doubles as your Baby Bunny Club membership card, and grants access to DAO benefits.
                            PizzapDAO will create and build a MetaVerse with online membership and offline voice pool (VoiceNFT).
                            Baby Bunny Club and PizzapDAO are huge economics. Value will grow by unlocking the roadmap step by step.
                        </p>
                    </div>
                </div>
                {/* Pool Count */}
                {/* <div className="pool-count">
                <ul>
                    {
                        countList.map((item: Total, index: number): ReactElement => {
                            return (
                                <li key={index}>
                                    <p>{item.name}</p>
                                    <p>{item.count}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div> */}

                {/* <div className="scroll-box">
                    <div className="shadow-line line-left"></div>
                    <div className="shadow-line line-right"></div>
                    <ul>
                        {
                            NFTs.map((item: string, index: number) => {
                                return (
                                    <li key={index}>
                                        <img src={item} />
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div> */}
                {/* List */}
                <div className="market-list">
                    {/* <Affix offsetTop={flag ? 80 : 100} onChange={(affixed) => console.log(affixed)} target={() => container}> */}
                    <div className="filter-box">
                        {/* <ul>

                            {
                                ['Items', 'Activities'].map((item: string, index: number): ReactElement => {
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
                        </ul> */}
                        <input type="text" placeholder="Search" />
                    </div>
                    {/* </Affix> */}
                    <div className="data-list">
                        <InfiniteScroll
                            key={list.length}
                            dataLength={list.length}
                            next={loadMoreData}
                            hasMore={list.length < total}
                            loader={<div className="loading-box"><Spin /><p>Loading...</p></div>}
                            endMessage={<EmptyCard />}
                            scrollableTarget="dataList"
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

        </div>
    )
};
export default MarketIndex;