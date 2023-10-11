import { Button, Spin } from "antd";
import { ReactElement, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { MintRankService } from '../../../request/api'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { calsAddress } from "../../../utils";
import { flag } from "../../../utils/source";
import { useNavigate } from "react-router-dom";

interface Data {
    img_urls: { minio_url: string }[],
    id: number,
    minter_name: string,
    total_mint: number,
    minter_avatar_url: string,
    minter: string
}

const CreatorCard = (): ReactElement => {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [wait, setWait] = useState<boolean>(false);
    const [data, setData] = useState<[]>([]);
    const navigate = useNavigate();
    const getDataList = async () => {
        setWait(true)
        const result = await MintRankService({
            chain_id: '8007736',
            contract_address: '0xa2822ac2662fe0cbf470d5721e24f8508ec43d33',
            page_num: 1,
            page_size: 10
        });
        setWait(false)
        const { data } = result;
        setData(data.data.item);
    };
    useEffect(() => {
        getDataList();
    }, [])
    return (
        <div className="creator-card">
            <div className="card-title-filter">
                <p className="title-tag">Top Creators</p>
                {false && <div className="filter-box">
                    <div className="view-more">
                        <Button type="default">
                            View More
                            <IconFont type="icon-arrow-up-right" />
                        </Button>
                    </div>
                </div>}
            </div>
            <div className="creator-list">
                {wait && <div className="loading-mask">
                    <Spin size="large" />
                </div>}
                <div className="mask"></div>
                <div className="mask left"></div>
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
                <Swiper
                    slidesPerView={flag ? 1 : window.innerWidth <= 1440 ? 3 : 4}
                    spaceBetween={30}
                    loop={flag ? true : false}
                    onSwiper={(swiper) => {
                        setSwiperRef(swiper);
                    }}
                    className="swiper-6"
                >
                    {
                        data.map((item: Data, index: number) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className="creator-inner" onClick={() => {
                                        navigate(`/owner?address=${item.minter}`)
                                    }}>
                                        <div className="img-box">
                                            <div className="img-outside">
                                                <img src={item.img_urls[0]?.minio_url} alt="" />
                                                <div className="loading-box-public">
                                                    <Spin />
                                                </div>
                                            </div>
                                            <div className="img-list">
                                                {
                                                    item.img_urls?.slice(1, 5).map((item: { minio_url: string }, index: number) => {
                                                        return (
                                                            <img src={item.minio_url} alt="" key={index} />
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <p className="name">{item.minter_name}</p>
                                        <div className="items-creator">
                                            <div className="account">
                                                <img src={item.minter_avatar_url} alt="" />
                                                <p>{calsAddress(item.minter)}</p>
                                            </div>
                                            <div className="items-box">{item.total_mint}&nbsp;ITEMS</div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
};

export default CreatorCard;