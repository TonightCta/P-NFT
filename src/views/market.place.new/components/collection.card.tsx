import { Button, Popover, Spin } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { CollectionList } from '../../../request/api';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { useNavigate } from "react-router-dom";
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import { flag } from "../../../utils/source";

interface Data {
    logo_minio_url: string,
    collection_name: string,
    poster_minio_url: string,
    collection_id: number,
    total_supply: number,
    creator_name: string
}

const CollectionCard = (): ReactElement => {
    const [open, setOpen] = useState(false);
    const [wait, setWait] = useState<boolean>(false);
    const [data, setData] = useState<Data[]>([]);
    const navigate = useNavigate();
    const { dispatch } = useContext(PNft);
    const hide = () => {
        setOpen(false);
    };
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const getDataList = async () => {
        setWait(true)
        const result = await CollectionList({
            page_size: 4
        });
        const { data } = result;
        setWait(false);
        setData(data.data.item);
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
                    slidesPerView={flag ? 1 : 4}
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
                                                collection_id: String(item.collection_id)
                                            }
                                        });
                                        navigate('/market')
                                    }}>
                                        <div className={`colleciton-logo ${item.collection_name === 'PAI SPACE' ? '' : 'other-l'}`}>
                                            <img src={item.collection_name === 'PAI SPACE' ? require('../../../assets/new/plian_logo.png') : require('../../../assets/new/eht_white_logo.png')} alt="" />
                                        </div>
                                        <div className="poster-img">
                                            <img className="" src={item.poster_minio_url} alt="" />
                                            <div className="loading-box-public">
                                                <Spin size="large" />
                                            </div>
                                        </div>
                                        <div className="msg-box">
                                            <p className="name">{item.collection_name}</p>
                                            <div className="items-creator">
                                                <div className="account">
                                                    <img src={item.logo_minio_url} alt="" />
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