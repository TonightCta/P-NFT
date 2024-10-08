import { Button, Spin } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { CollectionList } from '../../../request/api';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { useNavigate } from "react-router-dom";
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import { flag } from "../../../utils/source";
import { FilterChainInfo } from "../../../utils";
import { ErrorCard } from "../../../components/error.card";

interface Data {
    logo_url:string,
    poster_url:string,
    collection_name: string,
    contract_address: string,
    collection_id: number,
    total_supply: number,
    creator_name: string,
    chain_id: string,
    load: boolean,
    error: boolean
}

const CollectionCard = (): ReactElement => {
    const [open, setOpen] = useState(false);
    const [wait, setWait] = useState<boolean>(false);
    const [data, setData] = useState<Data[]>([]);
    const navigate = useNavigate();
    const { state, dispatch } = useContext(PNft);
    const hide = () => {
        setOpen(false);
    };
    const [swiperRef, setSwiperRef] = useState<any>(null);
    // const handleOpenChange = (newOpen: boolean) => {
    //     setOpen(newOpen);
    // };
    const getDataList = async () => {
        if (state.coll_one) {
            setData(JSON.parse(state.coll_one));
            return
        }
        setWait(true)
        const result = await CollectionList({
            page_size: 10
        });
        const { data } = result;
        setWait(false);
        const filter = data.data.item?.map((item: any) => {
            return item = {
                ...item,
                load: true,
                error: false
            }
        })
        dispatch({
            type: Type.SET_COLL_ONE,
            payload: {
                coll_one: filter
            }
        })
        setData(filter);
    };
    useEffect(() => {
        getDataList()
    }, [])
    const content = (
        <div className="select-chains-popover">
            <ul onClick={hide}>
                <li>All chains</li>
                <li>Plian</li>
            </ul>
        </div>
    )
    return (
        <div className="collection-card">
            <div className="card-title-filter">
                <p className="title-tag">Explore Collections</p>
                <div className="filter-box">
                    {/* <Popover onOpenChange={handleOpenChange} open={open} content={content} placement="bottom" trigger={['click']} title={null}>
                        <div className="select-chain">
                            <p>All chains</p>
                            <IconFont type="icon-xiangxia" className={`${open ? 'down-arrow' : ''}`} />
                        </div>
                    </Popover> */}
                    <div className="view-more">
                        <Button type="default" onClick={() => {
                            navigate('/collection')
                        }}>
                            View More
                            <IconFont type="icon-arrow-up-right" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="card-list">
                {wait && <div className="loading-mask">
                    <Spin size="large" />
                </div>}
                <div className="page-btn prev" onClick={() => {
                    swiperRef.slidePrev()
                }}>
                    <IconFont type="icon-xiangxia" />
                </div>
                <div className="page-btn next" onClick={() => {
                    swiperRef.slideNext()
                }}>
                    <IconFont type="icon-xiangxia" />
                </div>
                <div className="mask"></div>
                <div className="mask left"></div>
                <Swiper
                    slidesPerView={flag ? 'auto' : 4}
                    spaceBetween={48}
                    loop
                    onSwiper={(swiper) => {
                        setSwiperRef(swiper);
                    }}
                    className="swiper-5"
                >
                    {
                        data.map((item: Data, index: number) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className="card-inner" onClick={() => {
                                        dispatch({
                                            type: Type.SET_COLLECTION_ID,
                                            payload: {
                                                collection_id: String(item.collection_id),
                                            }
                                        });
                                        navigate(`/asset/${item.contract_address}`)
                                    }}>
                                        <div className={`colleciton-logo ${item.chain_id === '8007736' ? '' : 'other-l'}`}>
                                            <img src={FilterChainInfo(item.chain_id).logo} alt="" />
                                        </div>
                                        <div className="poster-img">
                                            <img className="" src={item.poster_url} alt="" onLoad={() => {
                                                const updataList = [...data];
                                                if (updataList[index]) {
                                                    updataList[index].load = !item.load;
                                                    setData(updataList);
                                                } else {
                                                    console.log('Invalid index')
                                                }
                                            }} onError={() => {
                                                const updataList = [...data];
                                                if (updataList[index]) {
                                                    updataList[index].error = !item.error;
                                                    setData(updataList);
                                                } else {
                                                    console.log('Invalid index')
                                                }
                                            }} />
                                            {item.load && <div className="loading-box-public">
                                                <Spin size="large" />
                                            </div>}
                                            {item.error && <ErrorCard />}
                                        </div>
                                        <div className="msg-box">
                                            <p className="name">{item.collection_name}</p>
                                            <div className="items-creator">
                                                <div className="account">
                                                    <img src={item.logo_url} alt="" />
                                                    <p>{item.creator_name}</p>
                                                </div>
                                                <div className="items-box">{item.total_supply}&nbsp;ITEMS</div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
                {/* <ul>
                    {
                        data.map((item: Data, index: number) => {
                            return (
                                <li key={index}>

                                </li>
                            )
                        })
                    }
                </ul> */}
            </div>
        </div>
    )
};

export default CollectionCard;