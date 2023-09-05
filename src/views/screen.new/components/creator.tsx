import { Button } from "antd";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { Screen2List } from '../../../request/api'

interface Card {
    file_minio_url: string,
    file_name: string,
    minter_minio_url: string,
    minter_name: string
}

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
                <img src={props.item.file_minio_url} alt="" className="nft-box" />
                <p>{props.item.file_name}</p>
                <div className="account-box">
                    <img src={props.item.minter_minio_url} alt="" />
                    <p>{props.item.minter_name}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="creator-wapper">
            <div className="list-box">
                <ul>
                    {
                        data.slice(0, 4).map((item: Card, index: number) => {
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
                        data.slice(4, 8).map((item: Card, index: number) => {
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
                        data.slice(8, 12).map((item: Card, index: number) => {
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
                        data.slice(12, 16).map((item: Card, index: number) => {
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
                        data.slice(16, 20).map((item: Card, index: number) => {
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
                        data.slice(20, 25).map((item: Card, index: number) => {
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