import { Button, Spin, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { ActivityJoinService, ActivityInfoService, CheckJoinService } from "../../../request/api";
import { PNft } from "../../../App";
import { GetUrlKey } from "../../../utils";
import copy from 'copy-to-clipboard'
import { useContract } from "../../../utils/contract";
import { useMetamask } from "../../../utils/metamask";
import { useSwitchChain } from "../../../hooks/chain";

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
        title: 'Activity Rules',
        text: '1.Creators who create AI NFTs will get certain income.'
    },
    {
        title: 'Quantity of activity',
        text: 'Limited to 1000 users per day, first come first served until supplies last.'
    }
]


const InviteCard = (): ReactElement => {
    const [isJoin, setISJoin] = useState<boolean>(false);
    const [resultS, setresultS] = useState<boolean>(true)
    const { state } = useContext(PNft);
    const [show, setShow] = useState<string>('');
    const [wait, setWait] = useState<boolean>(false);
    const [code, setCode] = useState<string>(GetUrlKey('code', window.location.href));
    const { connectMetamask } = useMetamask();
    const { switchC } = useSwitchChain();
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
        setTimeout(() => {
            setShow('view-1')
        })
    }, []);
    const joinActivityFN = async () => {
        if (!state.address) {
            await connectMetamask();
            return
        }
        await switchC(Number(process.env.REACT_APP_CHAIN))
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
        <div className={show}>
            <div className="invite-card">
                <div className="free-mint-card">
                    <div className="card-msg">
                        <p className="card-name">INVITE</p>
                        {/* <p className="name-2">Invite</p> */}
                    </div>
                    <p className="mobile-title">Invite</p>
                    <ul>
                        {
                            MintRemark.map((item: Mint, index: number): ReactElement => {
                                return (
                                    <li key={index}>
                                        <p>{item.title}</p>
                                        <p className="rule-options">{item.text}</p>
                                        {index === 0 && <p className="rule-options">2.Users who invite 3 friends to join through the invitation link and verify personal Twitter account on Pizzap web page (limited to 1,000 per day, distributed on the next day) will get 10 $PI.</p>}
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
                                        {/* <p className="join-content">Content 1</p> */}
                                        <div>
                                            <div className="invite-code-inp">
                                                <input type="text" value={code} readOnly={GetUrlKey('code', window.location.href) ? true : false} placeholder="Invite Code(Optional)" onChange={(e) => {
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
                                            <p>You had invited <span style={{ color: '#FF5C92' }}>{inviteInfo.invite_num}</span> friend</p>
                                            <p className="public-btn">
                                                <Button type="primary" onClick={() => {
                                                    copy(`${window.location.href}?code=${inviteInfo.code}`);
                                                    message.success('Copy Successfully!')
                                                }}>INVITE</Button>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="public-title">RECEIVE PI</p>
                                            <p className="pledge-num">Your unclaimed PI: <span>{inviteInfo.reward_num}</span></p>
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
        </div>
    )
};

export default InviteCard;