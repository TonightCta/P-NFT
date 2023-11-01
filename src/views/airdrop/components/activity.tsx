import { ReactElement, useContext, useEffect, useState } from "react";
import { ActivityRankService } from '../../../request/api'
import { FilterAddress, calsAddress } from "../../../utils";
import { Spin } from "antd";
import DefaultAvatar from "../../../components/default_avatar/default.avatar";
import { PNft } from "../../../App";

const ActivityCard = (): ReactElement => {
    // const [avatarList, setAvatarList] = useState<string[]>([]);
    const [rankList, setRankList] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [show, setShow] = useState<string>('');
    const { state } = useContext(PNft);
    const getRankList = async () => {
        const result = await ActivityRankService({
            chain_id: state.chain,
            contract_address: process.env.REACT_APP_CURRENTMODE === 'production' ? FilterAddress('8007736').contract_721 : FilterAddress('8007736').contract_721_test,
            page_size: 10,
            page_num: 1
        });
        const { data } = result;
        setRankList(data.data.item ? data.data.item : []);
        setTotal(data.data.total);
        setLoading(false);
    };
    useEffect(() => {
        getRankList();
        setTimeout(() => {
            setShow('view-2')
        })
    }, [])
    return (
        <div className={show}>
            <div className="activity-card">
                <div className="free-mint-card">
                    <div className="card-msg">
                        <p className="card-name">RANK</p>
                        {/* <p className="name-2">Rank</p> */}
                    </div>
                    <p className="mobile-title">Rank</p>
                    <ul>
                        <li>
                            <p>Activity Rules</p>
                            <p className="rule-options">
                                Users who create NFTs through AIGC will have the opportunity to earn high profits.
                                <br />
                                The top 3 creators with highest trading volume (created before 08/10/23) will win in turn: 50K $PI, 25K $PI, 15K $PI (* All the 90K $PI will be released on 08/11/23)
                            </p>
                        </li>
                    </ul>
                </div>
                <div className="rank-list">
                    <div className="rank-3-list">
                        {!loading
                            ? <ul>
                                <li>
                                    <div className="nfts-box">
                                        <div className="img-inner">
                                            {rankList[1]?.img_ipfs_url ? <img src={rankList[1].img_ipfs_url} alt="" /> : <DefaultAvatar address={rankList[1]?.contract_address} diameter={110} />}
                                        </div>
                                        <p>2</p>
                                    </div>
                                    <p className="address-text">{calsAddress(rankList[1].minter)}</p>
                                    <p className="price-text">{rankList[1].sell_price_pi}&nbsp;$PI</p>
                                </li>
                                <li>
                                    <img className="rank-1-icon" src={require('../../../assets/images/drop_rank_1.png')} alt="" />
                                    <div className="nfts-box">
                                        <div className="img-inner">
                                            {rankList[0]?.img_ipfs_url ? <img src={rankList[0].img_ipfs_url} alt="" /> : <DefaultAvatar address={rankList[0]?.contract_address} diameter={150} />}
                                        </div>
                                        <p>1</p>
                                    </div>
                                    <p className="address-text">{calsAddress(rankList[0].minter)}</p>
                                    <p className="price-text">{rankList[0].sell_price_pi}&nbsp;$PI</p>
                                </li>
                                <li>
                                    <div className="nfts-box">
                                        <div className="img-inner">
                                            {rankList[2]?.img_ipfs_url ? <img src={rankList[2].img_ipfs_url} alt="" /> : <DefaultAvatar address={rankList[2]?.contract_address} diameter={110} />}
                                        </div>
                                        <p>3</p>
                                    </div>
                                    <p className="address-text">{calsAddress(rankList[2].minter)}</p>
                                    <p className="price-text">{rankList[2].sell_price_pi}&nbsp;$PI</p>
                                </li>
                            </ul>
                            : <div style={{ marginTop: '40px' }}>
                                <Spin size="large" />
                            </div>
                        }
                    </div>
                    {/* <div className="rank-mine"></div> */}
                    <div className="list-box">
                        <div className="list-title">
                            <p>NFT</p>
                            <p>Volume</p>
                            <p>Latest Deals</p>
                        </div>
                        {
                            loading && <div style={{ marginTop: '40px' }}>
                                <Spin size="large" />
                            </div>
                        }
                        <ul>
                            {
                                rankList.slice(3, rankList.length).map((item: any, index: number): ReactElement => {
                                    return (
                                        <li key={index}>
                                            <div className="avatar-box">
                                                <p className="rank-num">{index + 4}</p>
                                                <div className="avatar-inner">
                                                    {item.img_ipfs_url ? <img src={item.img_ipfs_url} alt="" /> : <DefaultAvatar address={item.contract_address} diameter={60} />}
                                                </div>
                                                <p className="rank-name">{calsAddress(item.minter)}</p>
                                            </div>
                                            <div className="reward-msg">
                                                {/* <p>${item.sell_price_usdt}</p> */}
                                                <p>{item.sell_price_pi}&nbsp;$PI</p>
                                            </div>
                                            <p className="sell-hash" onClick={() => {
                                                window.open(`https://piscan.plian.org/tx/${item.sell_hash}?chain=1`)
                                            }}>{calsAddress(item.sell_hash)}</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {
                            total < 4 && !loading && <p className="no-more">No more</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ActivityCard;