import { ReactElement, useEffect, useState } from "react";
import { GalleryList, GalleryNFTList } from '../../../request/api';
import { Spin } from "antd";
import IconFont from "../../../utils/icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper'
import "swiper/css";
import 'swiper/css/pagination';
import { flag } from "../../../utils/source";

export interface Data {
    minter_minio_url: string,
    minter_name: string,
    file_description: string,
    file_name: string,
    file_minio_url: string
}

const TopScreen = (): ReactElement => {
    const [data, setData] = useState<Data[]>([]);
    const [active, setActive] = useState<number>(0);
    const [swiperRef, setSwiperRef] = useState<any>();
    const [ani, setAni] = useState<string>('');
    const getInfo = async () => {
        const result = await GalleryList({
            page_size: 100
        });
        const { data } = result;
        const lastShow = await GalleryNFTList({
            class_id: data.data.item[0].class_id
        });
        setData(lastShow.data.data.item);
    };
    useEffect(() => {
        getInfo();
    }, [])
    return (
        <div className={`top-screen ${ani}`}>
            <div className="bg-box">
                <img src={data[active]?.file_minio_url} alt="" />
                <div className="bg-mask"></div>
                <div className="linear-box"></div>
            </div>
            {data.length === 0 && <div className="loading-box">
                <Spin size="large" />
            </div>}
            <Swiper pagination={flag ? true : false} className="swiper-gallery" modules={[Pagination]} effect={'fade'} loop onSwiper={(swiper) => {
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
                                            Trending Work
                                        </p>
                                        <div className="creator-msg">
                                            <p className="creator-name">
                                                <img src={item.minter_minio_url} alt="" />
                                                {item.minter_name}
                                            </p>
                                            <p className="creator-title">{item.file_name}</p>
                                            <p className="creator-remark">{item.file_description}</p>
                                        </div>
                                    </div>
                                    <div className="first-nft-pic">
                                        <img src={item.file_minio_url} alt="" />
                                        <div className="loading-box">
                                            <Spin size="large" />
                                        </div>
                                    </div>
                                    <div className="mobile-creator-msg creator-msg">
                                        <p className="creator-name">
                                            <img src={item.minter_minio_url} alt="" />
                                            {item.minter_name}
                                        </p>
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