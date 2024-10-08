import { ReactElement, useContext, useEffect, useState } from "react";
import { GalleryList, GalleryNFTList } from '../../../request/api';
import { Spin, Image } from "antd";
import IconFont from "../../../utils/icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from 'swiper'
import "swiper/css";
import 'swiper/css/pagination';
import { flag } from "../../../utils/source";
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import { ErrorCard } from "../../../components/error.card";

export interface Data {
    file_url:string,
    minter_url:string,
    minter_name: string,
    file_description: string,
    file_name: string,
    load: boolean,
    error: boolean
}

const TopScreen = (): ReactElement => {
    const [data, setData] = useState<Data[]>([]);
    const { state, dispatch } = useContext(PNft);
    const [active, setActive] = useState<number>(0);
    const [swiperRef, setSwiperRef] = useState<any>();
    const [ani, setAni] = useState<string>('');
    const getInfo = async () => {
        if (state.gallery_one) {
            setData(JSON.parse(state.gallery_one));
            return
        }
        const result = await GalleryList({
            page_size: 100
        });
        const { data } = result;
        const lastShow = await GalleryNFTList({
            class_id: data.data.item[0].class_id
        });
        const filter = lastShow.data.data.item?.map((item: any) => {
            return item = {
                ...item,
                load: true,
                error: false
            }
        })
        dispatch({
            type: Type.SET_GALLERY_ONE,
            payload: {
                gallery_one: filter
            }
        })
        setData(filter);
    };
    useEffect(() => {
        getInfo();
    }, [])
    return (
        <div className={`top-screen ${ani}`}>
            <div className="bg-box">
                <img src={data[active]?.file_url} alt="" />
                <div className="bg-mask"></div>
                <div className="linear-box"></div>
            </div>
            {data.length === 0 && <div className="loading-box">
                <Spin size="large" />
            </div>}
            <Swiper autoplay={flag ? true : false} pagination={flag ? true : false} className="swiper-gallery" modules={[Pagination, Autoplay]} effect={'fade'} loop onSwiper={(swiper) => {
                setSwiperRef(swiper)
            }}>
                {
                    data.map((item: any, index: number) => {
                        return (
                            <SwiperSlide key={index}>
                                <div className="nft-inner-1">
                                    <div className="first-nft-msg">
                                        <p className="nft-title">
                                            <img src={require('../../../assets/new/gallery_icon_1.gif')} alt="" />
                                            Popular Works
                                        </p>
                                        <div className="creator-msg">
                                            <p className="creator-name">
                                                <img src={item.minter_url} alt="" />
                                                {item.minter_name}
                                            </p>
                                            <p className="creator-title">{item.file_name}</p>
                                            <p className="creator-remark">{item.file_description}</p>
                                        </div>
                                    </div>
                                    <div className="first-nft-pic">
                                        <Image src={item.file_url} onLoad={() => {
                                            const updateList = [...data];
                                            if (updateList[index]) {
                                                updateList[index].load = !item.load;
                                                setData(updateList);
                                            }
                                        }} onError={() => {
                                            const updateList = [...data];
                                            if (updateList[index]) {
                                                updateList[index].error = !item.error;
                                                setData(updateList);
                                            }
                                        }} />
                                        {item.load && <div className="loading-box">
                                            <Spin size="large" />
                                        </div>}
                                        {item.error && <div className="error-msg">
                                            <ErrorCard />
                                            <ErrorCard className="sec-e" />
                                        </div>}
                                    </div>
                                    <div className="mobile-creator-msg creator-msg">
                                        <div className="creator-name">
                                            <Image src={item.minter_url} />
                                            {item.minter_name}
                                        </div>
                                        <p className="creator-title">{item.file_name}</p>
                                        <p className="creator-remark">{item.file_description}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
            <div className="next-btn" onClick={() => {
                setAni('op-0')
                swiperRef.slideNext();
                setActive((active + 1) === data.length ? 0 : (active + 1))
                setTimeout(() => {
                    setAni('')
                }, 100)
            }}>
                <IconFont type="icon-fanhuijiantou" />
            </div>
        </div>
    )
};

export default TopScreen; 