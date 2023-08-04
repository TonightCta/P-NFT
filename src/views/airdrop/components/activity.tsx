import { ReactElement, useEffect, useState } from "react";
import { ActivityRankService } from '../../../request/api'
import { calsAddress } from "../../../utils";
import { Spin } from "antd";
import DefaultAvatar from "../../../components/default_avatar/default.avatar";
import { PlianContractAddress721Main, PlianContractAddress721Test } from "../../../utils/source";

const ActivityCard = (): ReactElement => {
    // const [avatarList, setAvatarList] = useState<string[]>([]);
    const [rankList, setRankList] = useState<any[]>([]);
    const [total,setTotal] = useState<number>(1);
    const [loading,setLoading] = useState<boolean>(true);
    const getRankList = async () => {
        const result = await ActivityRankService({
            chain_id: process.env.REACT_APP_CHAIN,
            contract_address:  process.env.REACT_APP_CURRENTMODE === 'production' ? PlianContractAddress721Main : PlianContractAddress721Test,
            page_size: 5,
            page_num: 1
        });
        const { data } = result;
        setRankList(data.data.item ? data.data.item : []);
        setTotal(data.data.total);
        setLoading(false);
    };
    useEffect(() => {
        getRankList();
    }, [])
    return (
        <div className="activity-card">
            <div className="activity-remark">
                <p>Activity Rules:</p>
                <p>
                Users who create NFTs through AIGC will have the opportunity to earn high profits. 
                </p>
                <p>
                The top 3 creators with highest trading volume (created before 30/09/23) will win in turn: 100K $PI, 50K $PI, 30K $PI (* All the 180K $PI will be released on 02/10/23)
                </p>
            </div>
            <div className="rank-list">
                <div className="list-title">
                    <p>NFT</p>
                    <p>Volume</p>
                    <p>Latest Deals</p>
                </div>
                {
                    loading && <div style={{marginTop:'40px'}}>
                        <Spin size="large"/>
                    </div>
                }
                <ul>
                    {
                        rankList.map((item: any, index: number): ReactElement => {
                            return (
                                <li key={index}>
                                    <p className="rank-num">{index + 1}</p>
                                    <div className="avatar-box">
                                        {item.img_ipfs_url ? <img src={item.img_ipfs_url} alt="" /> : <DefaultAvatar address={item.contract_address} diameter={60}/>}
                                    </div>
                                    <p className="rank-name">{calsAddress(item.minter)}</p>
                                    <div className="reward-msg">
                                        {/* <p>${item.sell_price_usdt}</p> */}
                                        <p>{item.sell_price_pi}&nbsp;$PI</p>
                                    </div>
                                    <p className="sell-hash" onClick={() => {
                                        window.open(`https://v2-piscan.plian.org/tx/${item.sell_hash}`)
                                    }}>{calsAddress(item.sell_hash)}</p>
                                </li>
                            )
                        })
                    }
                </ul>
                {
                    rankList.length === total && <p className="no-more">No more</p>
                }
            </div>
        </div>
    )
};

export default ActivityCard;