import { Button, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { PNft } from "../../../App";
import { useMetamask } from "../../../utils/metamask";
import IconFont from "../../../utils/icon";
import { SignInfoService, SignUpService } from '../../../request/api'
import Countdown from "antd/es/statistic/Countdown";

interface Mint {
    title: string,
    text: string
}
const MintRemark: Mint[] = [
    {
        title: 'Activity Rules:',
        text: 'X-certified users sign in at Pizzap will receive $PI (up to 1.5PI).'
    },
    {
        title: 'Total Reward:',
        text: 'Automatically distributed within the same day after your sign-in.'
    }
]

const FreeMintCard = (): ReactElement => {
    const [wait, setWait] = useState<boolean>(false);
    const [show, setShow] = useState<string>('')
    const { state } = useContext(PNft);
    const { connectMetamask } = useMetamask();
    const [point, setPoint] = useState<number>(0);
    const [pointReward, setPointReward] = useState<number>(0);
    const [checkInfo, setCheckInfo] = useState<any>();
    const time = 1 * 60 * 1000;
    const queryFN = async () => {
        if (!state.address) {
            await connectMetamask();
        }
        const result = await SignInfoService({
            user_address: state.address
        });
        const { status, data } = result;
        if (status !== 200) {
            message.error(result.msg);
            setCheckInfo({
                last_check_in:new Date().getTime() - 7 * 24 * 60 * 60 * 1000
            })
            return
        };
        setPoint(data.check_in_count);
        setPointReward(data.check_in_count);
        setCheckInfo(data);
    }
    const signInFN = async () => {
        if (!state.address) {
            await connectMetamask();
        }
        setWait(true);
        const result = await SignUpService({
            user_address:state.address,
            day:point + 1
        });
        setWait(false);
        const { status } = result;
        if(status !== 200){
            message.error(result.msg);
            return
        };
        message.success('Sign-in Successfuly');
        queryFN();
    }
    useEffect(() => {
        queryFN();
        setTimeout(() => {
            setShow('view-0')
        })
    }, [])
    return (
        <div className={show}>
            <div className="free-card">
                <div className="free-mint-card">
                    <div className="card-msg">
                        <div className="card-name other-set">
                            <p>DAILY</p>
                            <p>BONUS</p>
                        </div>
                        <p className="name-2">Daily bonus</p>
                    </div>
                    <ul>
                        {
                            MintRemark.map((item: Mint, index: number): ReactElement => {
                                return (
                                    <li key={index}>
                                        <p>{item.title}&nbsp;{index === 1 && <span>{checkInfo?.total_reward_pi ? checkInfo?.total_reward_pi : 0} $Pi</span>}</p>
                                        <p className="rule-options">{item.text}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="check-box">
                    <ul className="check-progress">
                        {
                            [1, 2, 3, 4, 5, 6, 7].map((item: number, index: number) => {
                                return (
                                    <li key={index} onClick={() => {
                                        if (item > point) {
                                            return
                                        }
                                        setPointReward(item);
                                    }} className={`${point >= item && 'checked-point'} ${pointReward === item && 'active-point'}`}>
                                        <div>
                                            {
                                                point >= item
                                                    ? <IconFont type="icon-check-bold" />
                                                    : <p>{item}</p>
                                            }
                                        </div>
                                    </li>
                                )
                            })
                        }
                        <li>
                            <div className={`progress-inner w-${point}`}></div>
                        </li>
                    </ul>
                    {pointReward >= 1 && <div className={`rewark-msg left-${pointReward}`}>
                        {/* <div className="arrow-box"></div> */}
                        <div className="title-msg">
                            <p>Rewards have been issued</p>
                            <p onClick={() => {
                                if(!checkInfo[`d${pointReward}_reward_tx_hash`]){
                                    message.info('Transaction in progress')
                                    return
                                }
                                window.open(`https://v2-piscan.plian.org/tx/${checkInfo[`d${pointReward}_reward_tx_hash`]}`)
                            }}>View on explorer</p>
                        </div>
                        <p className="hash-pub">Transaction Hash:</p>
                        <p className="hash-pub">{checkInfo[`d${pointReward}_reward_tx_hash`] ? checkInfo[`d${pointReward}_reward_tx_hash`] : '[Transaction in progress...]'}</p>
                    </div>}
                    <div className="btn-oper">
                        {
                            (new Date().getTime() - new Date(checkInfo?.last_check_in).getTime() < time) && point < 7
                                ? <Button type="default" className="count-done-btn" disabled>
                                    <Countdown valueStyle={{color:'white',fontSize:20}} onFinish={() => {
                                        queryFN();
                                    }} title={null} value={Date.now() + (time - (new Date().getTime() - new Date(checkInfo?.last_check_in).getTime()))} />
                                </Button>
                                : <Button type="primary" onClick={() => {
                                    signInFN()
                                }} loading={wait} disabled={point === 7 || wait}>{point === 7 ? 'Sign-in complete' : 'Sign-in'}</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FreeMintCard;