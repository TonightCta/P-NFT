import { Button, Spin, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { ActivityJoinService, ActivityInfoService, CheckJoinService } from "../../../request/api";
import { PNft } from "../../../App";
import { GetUrlKey } from "../../../utils";
import copy from 'copy-to-clipboard'
import { useContract } from "../../../utils/contract";

interface Mint {
    title: string,
    text: string
}
interface Info {
    code: string,
    reward_num: number,
    invite_num: number | string
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
    const [isJoin, setISJoin] = useState<boolean>(false);
    const [resultS, setresultS] = useState<boolean>(true)
    const { state } = useContext(PNft);
    const [wait, setWait] = useState<boolean>(false);
    const [code, setCode] = useState<string>(GetUrlKey('code', window.location.href));
    const [inviteInfo, setInviteInfo] = useState<Info>({
        code: '',
        reward_num: 0,
        invite_num: 0
    })
    const updateJoinStatus = async () => {
        const result: any = await CheckJoinService({
            user_address: state.address
        });
        const { status } = result;
        setresultS(false)
        if (status !== 200) {
            message.error(result.msg);
            return;
        };
        setISJoin(result.data)
    };
    const activityInfoFN = async () => {
        const result = await ActivityInfoService({
            user_address: state.address
        });
        const { data } = result;
        setInviteInfo({
            code: data.code,
            reward_num: data.reward_pi,
            invite_num: data.InviteNum
        })
    }
    useEffect(() => {
        activityInfoFN();
        updateJoinStatus();
    }, []);
    const joinActivityFN = async () => {
        setWait(true);
        const result = await ActivityJoinService({
            user_address: state.address,
            invite_code: code
        });
        const { status } = result;
        setWait(false);
        if (status !== 200) {
            message.error(result.msg)
            return
        };
        message.success('Join Successfully!')
        updateJoinStatus();
    };
    const claimForChainFN = async () => {
        if (inviteInfo.reward_num < 1) {
            message.error(`Available quantity is ${inviteInfo.reward_num}`);
            return
        }
        message.success('Successfully received the award!')
        activityInfoFN();
    }
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
            {resultS && <div className="public-bg">
                <Spin size="large" />
            </div>}
            {
                !resultS && <div>
                    {
                        !isJoin
                            ? <div className="step-1">
                                <div className="join-box public-bg">
                                    <p className="join-title">Join a friend's activity</p>
                                    <p className="join-content">Content 1</p>
                                    <div>
                                        <div className="invite-code-inp">
                                            <p>Invite Code&nbsp;:</p>
                                            <input type="text" value={code} readOnly={code ? true : false} placeholder="Invite Code" onChange={(e) => {
                                                setCode(e.target.value)
                                            }} />
                                        </div>
                                        <Button type="primary" size="large" disabled={wait} loading={wait} onClick={joinActivityFN}>Confirm and Join</Button>
                                    </div>
                                </div>
                            </div>
                            : <div className="invite-box public-bg step-2">
                                <ul>
                                    <li>
                                        <p className="public-title">INVITE</p>
                                        <div className="rank-list">
                                            <div className="list-progress">
                                                <div className="progress-inner" style={{ width: `${+inviteInfo.invite_num / 3 * 100}%` }}></div>
                                            </div>
                                        </div>
                                        <p className="public-btn">
                                            <Button type="primary" onClick={() => {
                                                copy(`https://j61p134344.zicp.fun/#/airdrop?code=${inviteInfo.code}`);
                                                message.success('Copy Successfully!')
                                            }}>INVITE</Button>
                                        </p>
                                    </li>
                                    <li>
                                        <p className="public-title">RECEIVE PI</p>
                                        <p className="pledge-num">Your unclaimed PI: {inviteInfo.reward_num}</p>
                                        <p className="public-btn disable-btn">
                                            <Button type="default" disabled={true} loading={wait} onClick={() => {
                                                claimForChainFN()
                                            }}>CLAIM</Button>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                    }
                </div>
            }
        </div>
    )
};

export default InviteCard;