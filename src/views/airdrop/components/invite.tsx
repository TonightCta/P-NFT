import { Button } from "antd";
import { ReactElement } from "react";

interface Mint {
    title: string,
    text: string
}
const MintRemark: Mint[] = [
    {
        title: 'Activity Rules:',
        text: 'Invite three Twitter friends to retweet the content of the activity and follow the @pizzap_io Twitter account to receive 10PI.'
    },
    {
        title: 'Quantity of activity:',
        text: 'Limited to 1000 users per day, first come first served until supplies last.'
    }
]

const InviteCard = (): ReactElement => {
    return (
        <div className="invite-card">
            <div className="free-mint-card">
                <ul>
                    {
                        MintRemark.map((item: Mint, index: number): ReactElement => {
                            return (
                                <li key={index}>
                                    <p>{item.title}</p>
                                    <p>{item.text}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="invite-box">
                <ul>
                    <li>
                        <p className="public-title">INVITE</p>
                        <div className="rank-list">
                            {
                                [1, 2, 3].map((item: number, index: number): ReactElement => {
                                    return (
                                        <div className="rank-pic" key={index}>
                                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <p className="public-btn">
                            <Button type="primary">INVITE</Button>
                        </p>
                    </li>
                    <li>
                        <p className="public-title">RECEIVE PI</p>
                        <p className="pledge-num">Your unclaimed PI: 10</p>
                        <p className="public-btn">
                            <Button type="primary">CLAIM</Button>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default InviteCard;