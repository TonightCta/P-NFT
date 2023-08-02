import { ReactElement, ReactNode, useState } from "react";
import FreeMintCard from "./components/free.mint";
import InviteCard from "./components/invite";
import ActivityCard from "./components/activity";
import './index.scss'

const AirdropView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    return (
        <div className="airdrop-view">
            <p className="drop-title">PIZZAP</p>
            <p className="drop-remark">Referral reward: Free voiceNFT minting</p>
            <div className="tabs">
                <ul>
                    {
                        ['FREE MINT', 'INVITE', 'Rank'].map((item: string, index: number): ReactElement => {
                            return (
                                <li key={index} className={`${active === index ? 'active-tab' : ''}`} onClick={() => {
                                    setActive(index)
                                }}>
                                    <p>{item}</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="card-view">
                {
                    active === 0 && <FreeMintCard /> ||
                    active === 1 && <InviteCard /> ||
                    active === 2 && <ActivityCard />
                }
                <p className="outside-remark">
                    Note: VoiceNFT of Pizzap is currently issued on Plian Mainnet Subchain 1. If your Plian Mainnet Main $PI tokens(from gate.io ) need to switch to the  Plian Mainnet Subchain 1, please go to <a target="_blank" href="https://wallet.plian.org/">https://wallet.plian.org/</a>.
                </p>
            </div>
        </div>
    )
};

export default AirdropView;