import { ReactElement } from "react";

const ActivityCard = (): ReactElement => {
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
                </div>
                <ul>
                    {
                        [1, 2, 3, 4].map((item: number, index: number): ReactElement => {
                            return (
                                <li key={index}>
                                    <p className="rank-num">{index + 1}</p>
                                    <div className="avatar-box">
                                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                    </div>
                                    <p className="rank-name">Alex</p>
                                    <div className="reward-msg">
                                        <p>$10000</p>
                                        <p>0.3&nbsp;BTC</p>
                                    </div>
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