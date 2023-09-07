import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import ListCard from "./components/list.card";
import IconFont from "../../utils/icon";
import { PNft } from "../../App";
import { CollectionInfo } from "../../request/api";
import { PlianContractAddress721Main } from "../../utils/source";
import { Spin } from "antd";

interface Account {
    icon: string,
    url: string
};


interface Info {
    bg_image_minio_url: string,
    collection_description: string,
    collection_name: string,
    total_supply: number,
    creator_earnings: number,
    discord_link: string,
    logo_minio_url: string,
    medium_link: string,
    tg_link: string,
    twitter_link: string,
    website_link: string,
    category_id: number
}

const MarketViewNew = (): ReactElement<ReactNode> => {
    const [info, setInfo] = useState<Info>();
    const { state } = useContext(PNft);
    const [sideList, setSideList] = useState<Account[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const getInfo = async () => {
        setWait(true);
        const result = await CollectionInfo({
            collection_id: +(state.collection_id as string),
            chain_id: '1',
            contract_address: PlianContractAddress721Main
        });
        setWait(false);
        const { data } = result;
        setInfo(data);
        setSideList([
            {
                icon: 'icon-globe-simple-bold',
                url: data.website_link
            },
            {
                icon: 'icon-telegram1',
                url: data.tg_link
            },
            {
                icon: 'icon-twitter-fill',
                url: data.twitter_link
            },
            {
                icon: 'icon-medium1',
                url: data.medium_link
            },
            {
                icon: 'icon-discord1',
                url: data.discord_link
            }
        ])
    };
    useEffect(() => {
        getInfo();
    }, [])
    return (
        <div className="market-view-new">
            {
                wait
                    ? <div className="loading-box">
                        <Spin size="large" />
                    </div>
                    : <div>
                        <div className="bg-box">
                            <img src={info?.bg_image_minio_url} alt="" />
                        </div>
                        <div className="content-box">
                            <div className="collection-logo">
                                <img src={info?.logo_minio_url} alt="" />
                            </div>
                            <div className="collection-name">
                                <p>{info?.collection_name}</p>
                                <ul>
                                    {
                                        sideList.map((item: Account, index: number) => {
                                            return (
                                                <li key={index} onClick={() => {
                                                    window.open(item.url)
                                                }}>
                                                    <IconFont type={item.icon} />
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <p className="collection-owner">By Pizzap</p>
                            <div className="collection-total">
                                <p>Total items<span>{info?.total_supply}</span></p>
                                <p>Created<span>Mar 2022</span></p>
                                <p>Creator earnings<span>{info?.creator_earnings}%</span></p>
                                <p>Chain<span>Plian</span></p>
                                <p>Category<span>{info?.category_id}</span></p>
                            </div>
                            <p className="unknow-text">Sci-fi collectable card game with NFTs</p>
                            <ListCard />
                        </div>
                    </div>}
        </div>
    )
};


export default MarketViewNew;