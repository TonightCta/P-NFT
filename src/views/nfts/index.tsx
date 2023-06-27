import { ReactElement, ReactNode, useEffect, useState } from "react";
import './index.scss'
import { CopyOutlined, TwitterOutlined } from "@ant-design/icons";
import CardItem from "../market/components/item.card";
import { Affix, Divider, Spin } from 'antd'
import InfiniteScroll from "react-infinite-scroll-component";
import TabList from "../detail/components/tab.list";

const OwnerNFTSView = (): ReactElement<ReactNode> => {
    const [changeTabs, setChangeTabs] = useState<string[]>(['Buy now', 'Ended']);
    const [activeTop, setActiveTop] = useState<number>(0);
    const [activeBot, setActiveBot] = useState<number>(0);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
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
    const selectTop = (_type:number) => {
        switch(_type){
            case 0:
                setChangeTabs(['Buy now', 'Ended'])
                break;
            case 1:
                setChangeTabs(['In Wallet', 'Favorites'])
                break;
            case 2:
                setChangeTabs(['Mine', 'Favorites'])
                break;
            default:
                setChangeTabs(['Buy now', 'Ended'])
        }
        setActiveTop(_type)
    }
    return (
        <div className="owner-view" id="ownerView" ref={setContainer}>
            <div className="account-msg">
                <div className="avatar-box">
                    <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                </div>
                <div className="msg-box">
                    <p className="msg-large">0x0000....0000</p>
                    <div className="outside-account">
                        <div className="address-text">
                            <p>0x0000....0000</p>
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
                            ['On sale', 'Items', 'Activities'].map((item: string, index: number): ReactElement => {
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
                <div className="tabs">
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
                </div>
                <div className="search-box">
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div className="conponenst-gater">
                {activeTop === 2 
                    ? <TabList/>
                    : <InfiniteScroll
                    key={data.length}
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < 50}
                    loader={<div className="loading-box"><Spin /><p>Loading...</p></div>}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="ownerView"
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
                </InfiniteScroll>}
            </div>
        </div>
    )
};

export default OwnerNFTSView;