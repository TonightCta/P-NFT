import { ReactElement, ReactNode, useState } from "react";
import './index.scss'
import { useNavigate } from "react-router-dom";
import { Affix, Divider, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import CardItem from "../market/components/item.card";

interface Cate {
    img: string,
    name: string,
    id: string | number,
    icon: string,
    show: boolean,
}
const cateList: Cate[] = [
    {
        img: require('../../assets/images/test.png'),
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
                        key={data.length}
                        dataLength={data.length}
                        next={loadMoreData}
                        hasMore={data.length < 50}
                        loader={<div className="loading-box"><Spin /><p>Loading...</p></div>}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="marketPlaceList"
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

export default MarketPlaceView;