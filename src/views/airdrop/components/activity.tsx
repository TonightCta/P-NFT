import { ReactElement, useEffect, useState } from "react";
import { ActivityRankService, ProfileService, QueryFile } from '../../../request/api'
import { calsAddress } from "../../../utils";
import { Spin } from "antd";

const ActivityCard = (): ReactElement => {
    const [avatarList, setAvatarList] = useState<string[]>([]);
    const [rankList, setRankList] = useState<any[]>([])
    const getRankList = async () => {
        const result = await ActivityRankService({
            chain_id: '8007736',
            contract_address: '0x1a0eCc31DACcA48AA877db575FcBc22e1FEE671b',
            page_size: 5,
            page_num: 1
        });
        const { data } = result;
        const inner: string[] = [];
        data.data.item.forEach(async (item: any) => {
            const info = await ProfileService({
                user_address: item.Minter
            });
            const avatar = await QueryFile({
                name: info.data.avatar_minio
            });
            inner.push(avatar.status === 200 ? avatar.data : require('../../../assets/images/WechatIMG20.jpeg'));
            setAvatarList([...inner])
        });
        setRankList(data.data.item);
    };
    useEffect(() => {
        setRankList(rankList.map((item: any, index: number) => {
            return item = {
                ...item,
                avatar: avatarList[index]
            }
        }))
    }, [avatarList])
    useEffect(() => {
        getRankList();
    }, [])
    return (
        <div className="activity-card">
            <div className="activity-remark">
                <p>Activity Rules:</p>
                <p>
                    Users who create NFTs through AIGC will have the opportunity to earn high profits. The top three users who
                    achieve the highest earnings will be rewarded with 100K PI (tokens), 50K PI (tokens), and 30K PI (tokens)
                    respectively.
                </p>
            </div>
            <div className="rank-list">
                <div className="list-title">
                    <p>User</p>
                    <p>Volume</p>
                    <p>Hash</p>
                </div>
                {
                    rankList.length === 0 && <div style={{marginTop:'40px'}}>
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
                                        <img src={item.avatar} alt="" />
                                    </div>
                                    <p className="rank-name">{calsAddress(item.Minter)}</p>
                                    <div className="reward-msg">
                                        <p>${item.SellPriceUSDT}</p>
                                        <p>{item.SellPricePI / 1e18}&nbsp;PI</p>
                                    </div>
                                    <p className="sell-hash" onClick={() => {
                                        window.open(`https://v2-piscan.plian.org/tx/${item.SellHash}`)
                                    }}>{calsAddress(item.SellHash)}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default ActivityCard;