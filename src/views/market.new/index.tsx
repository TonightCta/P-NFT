import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import ListCard from "./components/list.card";
import IconFont from "../../utils/icon";
import { PNft } from "../../App";
import { CollectionInfo } from "../../request/api";
import { Button, Spin, message } from "antd";
import { DateConvert, FilterAddress, randomString } from "../../utils";
import { useSwitchChain } from "../../hooks/chain";
import { useContract } from "../../utils/contract";

interface Account {
    icon: string,
    url: string
};

export interface Info {
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
    category_id: number,
    creat_time: number,
    category_name: string,
    collection_id: string,
    chain_id:string
}

const MarketViewNew = (): ReactElement<ReactNode> => {
    const [info, setInfo] = useState<Info>();
    const { state } = useContext(PNft);
    const [sideList, setSideList] = useState<Account[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const [bgLoad, setBgLoad] = useState<boolean>(true);
    const [mintTotal, setMintTotal] = useState<number>(0);
    const { switchC } = useSwitchChain();
    const { BBCPoolTotal, transHash, BBCBuy } = useContract();
    const [mintNum, setMintNum] = useState<number | string>('');
    const [mint, setMint] = useState<boolean>(false);
    const getInfo = async () => {
        setWait(true);
        const result = await CollectionInfo({
            collection_id: +(state.collection_id as string),
            chain_id: '1',
            contract_address: FilterAddress(state.chain as string).contract_721
        });
        setWait(false);
        const { data } = result;
        setInfo(data);
        if (+(info?.collection_id as string) === 2) {
            await switchC(1);
            const total = await BBCPoolTotal();
            setMintTotal(total)
        };
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
    const mintBBC = async () => {
        if (!mintNum || mintNum === 0) {
            message.error('Please enter the number');
            return
        }
        setMint(true);
        const nonce = randomString();
        const hash = await transHash(String(mintNum), nonce);
        const result: any = await BBCBuy(hash, String(mintNum), nonce);
        setMint(false);
        if (!result || result.message) {
            message.error(result.message)
            return
        };
        message.success('Mint Successful!');
        setMintNum('');
    }
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
                            <img src={info?.bg_image_minio_url} onLoad={() => {
                                setBgLoad(false)
                            }} alt="" />
                            {bgLoad && <div className="load">
                                <Spin size="large" />
                            </div>}
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
                            <div className="i-msg">
                                {/* collection_id */}
                                <div className="old-i">
                                    <div className="collection-total">
                                        <p>Total items<span>{info?.total_supply}</span></p>
                                        {info?.creat_time && <p>Created<span>{DateConvert(info?.creat_time)}</span></p>}
                                        <p>Creator earnings<span>{info?.creator_earnings}%</span></p>
                                        {info?.chain_id && <p>Chain<span>{FilterAddress(info.chain_id).chain_name}</span></p>}
                                        <p>Category<span>{info?.category_name}</span></p>
                                    </div>
                                    <p className="unknow-text">{info?.collection_description}</p>
                                </div>
                                {
                                    +(info?.collection_id as string) === 2 && <div className="mint-bbc">
                                        <div>
                                            <input type="number" maxLength={5} value={mintNum} onChange={(e) => {
                                                if (+e.target.value > 5) {
                                                    setMintNum(5);
                                                    return
                                                }
                                                if (+e.target.value < 0) {
                                                    setMintNum(0);
                                                    return
                                                }
                                                setMintNum(e.target.value)
                                            }} placeholder="1-5" />
                                            <div className="total">{mintTotal === 0 ? <Spin size="small" /> : mintTotal}/10000</div>
                                        </div>
                                        <p>
                                            <Button onClick={mintBBC} loading={mint} disabled={mint}>Mint</Button>
                                        </p>
                                    </div>
                                }
                            </div>
                            {info?.chain_id && <ListCard chainID={info.chain_id}/>}
                        </div>
                    </div>}
        </div>
    )
};


export default MarketViewNew;