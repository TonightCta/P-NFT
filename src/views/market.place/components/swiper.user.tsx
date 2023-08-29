import { ReactElement, useContext, useEffect, useState } from "react";
import { Cate } from "..";
import { calsAddress } from "../../../utils";
import { Type } from "../../../utils/types";
import { PNft } from "../../../App";
import { useSwitchChain } from "../../../hooks/chain";
import { NFTAddress } from "../../../utils/contract";
import { MintRankService } from "../../../request/api";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

const cateSwiper: Cate[] = [

    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "First",
        rank_icon: require('../../../assets/images/rank_1.png'),
        name_p: 'Spark',
        id: 1,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 521,
        rank_color: '#EF466F'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "Second",
        rank_icon: require('../../../assets/images/rank_2.png'),
        name_p: 'Digi ART',
        id: 2,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
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
        rank_icon: require('../../../assets/images/rank_3.png'),
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "",
        rank_icon: '',
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: '',
        rank_icon: '',
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "",
        rank_icon: '',
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "",
        rank_icon: '',
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "",
        rank_icon: '',
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "",
        rank_icon: '',
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
    {
        img: '',
        img_1: '',
        img_2: '',
        img_3: '',
        name: "",
        rank_icon: '',
        name_p: 'Something Beautiful',
        id: 3,
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        show: true,
        item: 196,
        rank_color: '#45B26B'
    },
]
interface Rank {
    total_mint: number,
    minter: string,
    minter_name: string,
    minter_avatar_url: string,
    img_urls: { ipfs_url: string }[],
    loading: boolean
}
interface Props{
    outSwiper:(current:any) => void,
    showNext:(value:boolean) => void
}

const SwiperUser = (props:Props): ReactElement => {
    const { dispatch } = useContext(PNft);
    const [rankMsg, setRankMsg] = useState<Rank[]>([
        {
            total_mint: 0,
            minter: '',
            minter_name: '',
            minter_avatar_url: '',
            loading: true,
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
            loading: true,
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
            loading: true,
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
    const { switchC } = useSwitchChain();
    const navigate = useNavigate();
    const getMintRank = async () => {
        await switchC(Number(process.env.REACT_APP_CHAIN))
        const result = await MintRankService({
            chain_id: process.env.REACT_APP_CHAIN,
            contract_address: NFTAddress,
            page_size: 10,
            page_num: 1
        });
        props.showNext(true);
        result.data.data.item && setRankMsg(result.data.data.item);
    };
    useEffect(() => {
        getMintRank()
    }, [])
    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={40}
            loop
            onSwiper={(swiper) => {
                props.outSwiper(swiper);
            }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            className="swiper-5"
        >
            {
                cateSwiper.map((item: Cate, index: number): ReactElement => {
                    return (
                        <SwiperSlide key={index} onClick={() => {
                            if (!rankMsg[index]) {
                                return
                            }
                            dispatch({
                                type: Type.SET_OWNER_ADDRESS,
                                payload: {
                                    owner_address: rankMsg[index].minter
                                }
                            });
                            navigate('/owner')
                        }}>
                            {rankMsg[index] && rankMsg[index].loading && <div className="loading-box">
                                <Spin size="large" />
                            </div>}
                            <div className="banner-box">
                                {index <= 2 && <div className="rank-box" style={{ backgroundColor: item.rank_color }}>
                                    <img src={item.rank_icon} alt="" />
                                    <p>{`#${item.id}`}</p>
                                </div>}
                                <img src={rankMsg[index] ? rankMsg[index].img_urls[0] ? rankMsg[index].img_urls[0].ipfs_url : item.img : item.img} className="alone-img" alt="" />
                                <div className="img-other">
                                    <img src={rankMsg[index] ? rankMsg[index].img_urls[1] ? rankMsg[index].img_urls[1].ipfs_url : item.img_1 : item.img_1} alt="" />
                                    <img src={rankMsg[index] ? rankMsg[index].img_urls[2] ? rankMsg[index].img_urls[2].ipfs_url : item.img_2 : item.img_2} alt="" />
                                    <img src={rankMsg[index] ? rankMsg[index].img_urls[3] ? rankMsg[index].img_urls[3].ipfs_url : item.img_3 : item.img_3} alt="" />
                                </div>
                            </div>
                            <p className={`${!item.show ? 'need-left' : ''}`}>{(rankMsg[index] ? rankMsg[index].minter_name : item.name)}</p>
                            <div className="icon-box">
                                <div>
                                    <img src={rankMsg[index] ? rankMsg[index].minter_avatar_url : ''} alt="" />
                                    <span>{calsAddress(rankMsg[index] ? rankMsg[index].minter : '')}</span>
                                </div>
                                <p>{rankMsg[index] ? rankMsg[index].total_mint : 0}&nbsp;ITEMS</p>
                            </div>
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
    )
};

export default SwiperUser;