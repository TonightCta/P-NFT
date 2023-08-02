import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import CardItem from "../market/components/item.card";
import { MintRankService, NFTMarketService } from "../../request/api";
import { NFTItem, Type } from "../../utils/types";
import EmptyCard from "../../components/empty";
import MaskCard from "../../components/mask";
import { PNft } from "../../App";
import { useContract } from "../../utils/contract";
import { calsAddress } from "../../utils";
import { PlianContractAddress721Main, PlianContractAddress721Test } from "../../utils/source";

interface Cate {
    img: string,
    img_1: string,
    img_2: string,
    img_3: string,
    name: string,
    id: string | number,
    icon: string,
    show: boolean,
    rank_icon: string,
    item: number,
    name_p: string,
    rank_color: string,
}

interface Rank {
    total_mint: number, 
    minter: string, 
    minter_name: string, 
    minter_avatar_url: string, 
    img_urls: { ipfs_url: string }[],
    loading:boolean
}
const cateList: Cate[] = [
    {
        img: require('../../assets/nfts/s_1.png'),
        img_1: require('../../assets/nfts/s_2.png'),
        img_2: require('../../assets/nfts/s_3.png'),
        img_3: require('../../assets/nfts/s_4.png'),
        name: 'PAI SPACE',
        name_p: 'Pizzap Offical',
        rank_icon: require('../../assets/images/fire.gif'),
        id: 0,
        icon: require('../../assets/images/favicon.png'),
        show: true,
        item: 1211,
        rank_color: '#3772FF'
    },
    {
        img: require('../../assets/nfts/s_5.png'),
        img_1: '',
        img_2: '',
        img_3: '',
        name: "First",
        rank_icon: require('../../assets/images/rank_1.png'),
        name_p: 'Spark',
        id: 1,
        icon: require('../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 521,
        rank_color: '#EF466F'
    },
    {
        img: require('../../assets/nfts/s_9.png'),
        img_1: '',
        img_2: '',
        img_3: '',
        name: "Second",
        rank_icon: require('../../assets/images/rank_2.png'),
        name_p: 'Digi ART',
        id: 2,
        icon: require('../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 238,
        rank_color: '#9757D7'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "Third",
        rank_icon: require('../../assets/images/rank_3.png'),
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
];
const MarketPlaceView = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    const { dispatch } = useContext(PNft);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [list, setList] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(1);
    // const [activeCate, setActiveCate] = useState<number>(0);
    const { officalTotalSupply } = useContract();
    const [officalTotal, setOfficalTotal] = useState<number>(0);
    const [rankMsg, setRankMsg] = useState<Rank[]>([
        {
            total_mint: 0,
            minter: '',
            minter_name: '',
            minter_avatar_url: '',
            loading:true,
            img_urls: [
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
            ],
        },
        {
            total_mint: 0,
            minter: '',
            minter_name: '',
            minter_avatar_url: '',
            loading:true,
            img_urls: [
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
            ],
        },
        {
            total_mint: 0,
            minter: '',
            minter_name: '',
            minter_avatar_url: '',
            loading:true,
            img_urls: [
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
                {
                    ipfs_url: ''
                },
            ],
        },
    ]);
    const getMintRank = async () => {
        const result = await MintRankService({
            chain_id: '8007736',
            contract_address: process.env.REACT_APP_CURRENTMODE === 'production' ? PlianContractAddress721Main : PlianContractAddress721Test,
            page_size: 3,
            page_num: 1
        });
        setRankMsg(result.data.data.item);
    };
    useEffect(() => {
        getMintRank();
        const totalCals = async () => {
            setOfficalTotal(await officalTotalSupply())
        };
        totalCals();
        loadMoreData();
    }, [])
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
        marketListFN();
    };
    return (
        <div className="market-place-view" id="marketPlaceList">
            <MaskCard />
            <div className="up-mask">
                <p className="place-title">Explore Collections</p>
                <div className="cate-list">
                    <ul>
                        {
                            cateList.map((item: Cate, index: number): ReactElement => {
                                return (
                                    <li key={index} onClick={() => {
                                        const detail = () => {
                                            if (!rankMsg[index - 1]) {
                                                return
                                            }
                                            dispatch({
                                                type: Type.SET_OWNER_ADDRESS,
                                                payload: {
                                                    owner_address: rankMsg[index - 1].minter
                                                }
                                            });
                                            navigate('/owner')
                                        }
                                        item.id === 0 ? navigate('/market') : detail();
                                    }}>
                                        {item.id !== 0 && rankMsg[index - 1] && rankMsg[index - 1].loading && <div className="loading-box">
                                            <Spin size="large" />
                                        </div>}
                                        <div className="banner-box">
                                            <div className="rank-box" style={{ backgroundColor: item.rank_color }}>
                                                <img src={item.rank_icon} alt="" />
                                                <p>{item.id === 0 ? 'Hot' : `#${item.id}`}</p>
                                            </div>
                                            <img src={item.id === 0 ? item.img : rankMsg[index - 1] ? rankMsg[index - 1].img_urls[0] ? rankMsg[index - 1].img_urls[0].ipfs_url : item.img : item.img} className="alone-img" alt="" />
                                            <div className="img-other">
                                                <img src={item.id === 0 ? item.img_1 : rankMsg[index - 1] ? rankMsg[index - 1].img_urls[1] ? rankMsg[index - 1].img_urls[1].ipfs_url : item.img_1 : item.img_1} alt="" />
                                                <img src={item.id === 0 ? item.img_2 : rankMsg[index - 1] ? rankMsg[index - 1].img_urls[2] ? rankMsg[index - 1].img_urls[2].ipfs_url : item.img_2 : item.img_2} alt="" />
                                                <img src={item.id === 0 ? item.img_3 : rankMsg[index - 1] ? rankMsg[index - 1].img_urls[3] ? rankMsg[index - 1].img_urls[3].ipfs_url : item.img_3 : item.img_3} alt="" />
                                            </div>
                                        </div>
                                        <p className={`${!item.show ? 'need-left' : ''}`}>{item.id === 0 ? item.name : (rankMsg[index - 1] ? rankMsg[index - 1].minter_name : item.name)}</p>
                                        <div className="icon-box">
                                            <div>
                                                <img src={item.id === 0 ? item.icon : rankMsg[index - 1] ? rankMsg[index - 1].minter_avatar_url : ''} alt="" />
                                                <span>{item.id === 0 ? item.name_p : calsAddress(rankMsg[index - 1] ? rankMsg[index - 1].minter : '')}</span>
                                            </div>
                                            <p>{item.id === 0 ? officalTotal : rankMsg[index - 1] ? rankMsg[index - 1].total_mint : 0}&nbsp;ITEMS</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <p className="place-title">Discover</p>
                <div className="discover-card">
                    {/* <Affix offsetTop={100} onChange={(affixed) => console.log(affixed)} target={() => container}> */}
                    <div className="filter-box">
                        <ul>

                            {
                                ['Activities'].map((item: string, index: number): ReactElement => {
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
                        {/* <input type="text" placeholder="Search" /> */}
                    </div>
                    {/* <div className="catefilter-list">
                        <ul>
                            {
                                ['All', 'Scenery', 'Avatar', 'Technology', 'Character', 'Unit', 'Life', 'Animals', 'Festivals', 'Home'].map((item: string, index: number) => {
                                    return (
                                        <li key={index} className={`${activeCate === index && 'active-cate'}`} onClick={() => {
                                            setActiveCate(index)
                                        }}>{item}</li>
                                    )
                                })
                            }
                        </ul>
                    </div> */}
                    {/* </Affix> */}
                    <div className="data-list">
                        <InfiniteScroll
                            key={list.length}
                            dataLength={list.length}
                            next={loadMoreData}
                            hasMore={list.length < total}
                            loader={<div className="loading-box"><Spin /><p>Loading...</p></div>}
                            endMessage={<EmptyCard />}
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

        </div>
    )
};

export default MarketPlaceView;