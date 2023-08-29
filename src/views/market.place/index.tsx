import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import './index.scss'
import { useNavigate } from "react-router-dom";
import { Pagination, Spin } from "antd";
import CardItem from "../market/components/item.card";
import { MintRankService, NFTMarketService } from "../../request/api";
import { NFTItem, Type } from "../../utils/types";
import MaskCard from "../../components/mask";
import { PNft } from "../../App";
import { NFTAddress, useContract } from "../../utils/contract";
import { useSwitchChain } from "../../hooks/chain";
import SwiperUser from "./components/swiper.user";
import IconFont from "../../utils/icon";

export interface Cate {
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
];

const MarketPlaceView = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<number>(0);
    const [list, setList] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const swiperRef: any = useRef(null)
    const [total, setTotal] = useState<number>(1);
    // const [activeCate, setActiveCate] = useState<number>(0);
    const [officalTotal, setOfficalTotal] = useState<number>(0);
    const { officalTotalSupply } = useContract();
    const [nextBtn, setNextBtn] = useState<boolean>(false);
    const getRank = async () => {
        setOfficalTotal(await officalTotalSupply())
    }
    const marketListFN = async () => {
        setLoading(true);
        const result = await NFTMarketService({
            chain_id: process.env.REACT_APP_CHAIN,
            page_size: 15,
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
        setList(filter);
    };
    useEffect(() => {
        getRank();
    }, []);
    useEffect(() => {
        marketListFN();
    }, [page])
    return (
        <div className="market-place-view" id="marketPlaceList">
            <MaskCard />
            <div className="up-mask">
                <p className="place-title">The Explore Collections</p>
                <div className="cate-list">
                    <ul>
                        {
                            cateList.map((item: Cate, index: number): ReactElement => {
                                return (
                                    <li key={index} onClick={() => {
                                        navigate('/market')
                                    }}>
                                        <div className="banner-box">
                                            <div className="rank-box" style={{ backgroundColor: item.rank_color }}>
                                                <img src={item.rank_icon} alt="" />
                                                <p>Hot</p>
                                            </div>
                                            <img src={item.img} className="alone-img" alt="" />
                                            <div className="img-other">
                                                <img src={item.img_1} alt="" />
                                                <img src={item.img_2} alt="" />
                                                <img src={item.img_3} alt="" />
                                            </div>
                                        </div>
                                        <p className={`${!item.show ? 'need-left' : ''}`}>{item.name}</p>
                                        <div className="icon-box">
                                            <div>
                                                <img src={item.icon} alt="" />
                                                <span>{item.name_p}</span>
                                            </div>
                                            <p>{officalTotal}&nbsp;ITEMS</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <SwiperUser showNext={(val: boolean) => {
                        setNextBtn(val);
                    }} outSwiper={(current: any) => {
                        swiperRef.current = current;
                    }} />
                    {nextBtn && <div className="next-silde">
                        <IconFont type="icon-caret-circle-right" onClick={() => {
                            swiperRef.current.slideNext()
                        }} />
                    </div>}
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
                        <div className="list-item" >
                            {loading && <div className="load-data-box">
                                <Spin size="large" />
                            </div>}
                            {
                                list.map((item: NFTItem, index: number) => {
                                    return (
                                        <CardItem key={index} item={item} />
                                    )
                                })
                            }
                        </div>
                        <div className="page-oper">
                            <Pagination defaultCurrent={page} pageSize={15} total={total} onChange={(page) => {
                                window.scrollTo({
                                    top: 220,
                                    behavior: 'smooth'
                                })
                                setPage(page)
                            }} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
};

export default MarketPlaceView;