import { ReactElement, ReactNode, useEffect, useState } from "react";
import './index.scss'
import CardItem from "./components/item.card";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Affix, Divider, Spin } from "antd";

interface Community {
    icon: string,
    url: string
}

interface Total {
    name: string,
    count: number
}

const CountSource: Total[] = [
    {
        name: 'TRADED',
        count: 890
    },
    {
        name: 'PLAYERS',
        count: 890
    },
    {
        name: 'LISTED',
        count: 890
    },
    {
        name: 'VOL(BTC)',
        count: 890
    },
    {
        name: 'FLOOR(BTC)',
        count: 2.5
    },
]
const MarketIndex = (): ReactElement<ReactNode> => {
    const communityList: Community[] = [
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        }
    ];
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [countList, setCountList] = useState<Total[]>(CountSource);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [data, setData] = useState<number[]>([1, 2, 3, 4, 5, 6]);
    const [loading, setLoading] = useState<boolean>(false);
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
            .then((res) => res.json())
            .then((body) => {
                setData([...data, ...body.results]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        loadMoreData();
    }, []);
    return (
        <div className="market-index" id="dataList" ref={setContainer}>
            <p className="market-title">Baby Bunny</p>
            {/* 社区分享 */}
            <div className="com-list">
                <ul>
                    {
                        communityList.map((item: Community, index: number): ReactElement => {
                            return (
                                <li key={index}>
                                    <img src={item.icon} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            {/* Pool Count */}
            <div className="pool-count">
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
            </div>
            {/* List */}
            <div className="market-list">
                <Affix offsetTop={100} onChange={(affixed) => console.log(affixed)} target={() => container}>
                    <div className="filter-box">
                        <ul>

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
                        </ul>
                        <input type="text" placeholder="Search" />
                    </div>
                </Affix>
                <div className="data-list">
                    <InfiniteScroll
                        key={data.length}
                        dataLength={data.length}
                        next={loadMoreData}
                        hasMore={data.length < 50}
                        loader={<div className="loading-box"><Spin /><p>Loading...</p></div>}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="dataList"
                    >
                        <div className="list-item" >
                            {
                                data.map((item: number, index: number) => {
                                    return (
                                        <CardItem key={index} />
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
export default MarketIndex;