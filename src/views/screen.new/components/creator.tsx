import { Button } from "antd";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { Screen2List } from '../../../request/api'

interface Card {
    img: string,
    nft_name: string,
    icon: string,
    name: string
}

const Te: Card[] = [
    {
        img: require('../../../assets/new/IMG_2130.png'),
        nft_name: 'Flourish',
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        name: 'Marquez'
    },
    {
        img: require('../../../assets/new/IMG_2740.png'),
        nft_name: 'Flourish',
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        name: 'Marquez'
    },
    {
        img: require('../../../assets/new/IMG_4038.png'),
        nft_name: 'Flourish',
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        name: 'Marquez'
    },
    {
        img: require('../../../assets/new/test_banner.png'),
        nft_name: 'Flourish',
        icon: require('../../../assets/images/WechatIMG20.jpeg'),
        name: 'Marquez'
    }
]

const CreatorWapper = (): ReactElement<ReactNode> => {
    const [data, setData] = useState<Card[]>([]);
    const getDataList = async () => {
        const result = await Screen2List({
            page_size: 24,
        });
        console.log(result);
        const { data } = result;
        setData(data.data.item);
    };
    useEffect(() => {
        getDataList();
    }, [])
    const CreatorCard = (props: { item: Card }) => {
        return (
            <div className="creator-card">
                <img src={props.item.img} alt="" className="nft-box" />
                <p>{props.item.nft_name}</p>
                <div className="account-box">
                    <img src={props.item.icon} alt="" />
                    <p>{props.item.name}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="creator-wapper">
            <div className="list-box">
                <ul>
                    {
                        Te.map((item: Card, index: number) => {
                            return (
                                <li key={index}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        Te.map((item: Card, index: number) => {
                            return (
                                <li key={index}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        Te.map((item: Card, index: number) => {
                            return (
                                <li key={index}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        Te.map((item: Card, index: number) => {
                            return (
                                <li key={index}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        Te.map((item: Card, index: number) => {
                            return (
                                <li key={index}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul className="no-right">
                    {
                        Te.map((item: Card, index: number) => {
                            return (
                                <li key={index}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <p className="view-more">
                <Button type="default">
                    View More
                    <IconFont type="icon-arrow-up-right" />
                </Button>
            </p>
            <div className="mask-box"></div>
        </div>
    )
};

export default CreatorWapper;