import { ReactElement, ReactNode, useState } from "react";
import FreeMintCard from "./components/free.mint";
import InviteCard from "./components/invite";
import ActivityCard from "./components/activity";
import './index.scss'
import { VERSION, flag } from "../../utils/source";
import IconFont from "../../utils/icon";
import FooterNew from "../screen.new/components/footer.new";

const AirdropView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    return (
        <div className={`airdrop-view ${VERSION === 'new' ? 'airdrop-view-new' : ''}`}>
            {VERSION !== 'new'
                ? <div className="bg-box">
                    <img src={require('../../assets/images/drop_bg.png')} alt="" />
                </div>
                : <div className="bg-box-new">
                    <img src={require(`../../assets/images/${flag ? 'airdrop_mobile_bg' : 'airdrop_new_bg'}.png`)} alt="" />
                </div>
            }

            <div className="drop-inner" style={{ zIndex: 100, position: 'relative' }}>
                {VERSION !== 'new' && <p className="drop-title">PIZZAP</p>}
                {VERSION !== 'new' && <p className="drop-remark">Referral reward: Daily bonus</p>}
                <div className="pc-card">
                    <div className="tabs">
                        <ul className="select-card">
                            {
                                ['Daily Bonus', 'Invite', 'Rank'].map((item: string, index: number): ReactElement => {
                                    return (
                                        <li key={index} className={`select-card-li ${active === index ? 'active-tab' : ''}`} onClick={() => {
                                            setActive(index)
                                        }}>
                                            <p>{item}{ VERSION === 'new' && <IconFont type="icon-arrow-up-right"/> }</p>
                                            <div className="ac-mask"></div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div className="mobile-line">
                            <div className="line-inner" style={{width:`${active === 0 && 33 || active === 1 && 66 || active === 2 && 100 || 0}%`}}></div>
                        </div>
                    </div>
                    <div className="card-view">
                        {
                            active === 0 && <FreeMintCard /> ||
                            active === 1 && <InviteCard /> ||
                            active === 2 && <ActivityCard />
                        }
                    </div>
                </div>
                <div className="mobile-card">
                    <div className="tabs">
                        <ul className="select-card">
                            {/* {
                                ['DAILY BONUS', 'INVITE', 'Rank'].map((item: string, index: number): ReactElement => {
                                    return (
                                        <li key={index} className={`${active === index ? 'active-tab' : ''}`} onClick={() => {
                                            setActive(index)
                                        }}>
                                            <p>{item}</p>
                                            <div className="ac-mask"></div>
                                        </li>
                                    )
                                })
                            } */}
                            <li className={`select-card-li ${active === 0 ? 'active-tab' : ''}`} onClick={() => {
                                setActive(0)
                                window.scrollTo({
                                    top: 100,
                                    behavior: 'smooth'
                                })
                            }}>
                                <p>DAILY BONUS</p>
                                <div className="ac-mask"></div>
                            </li>
                            {
                                active === 0 &&
                                <div className="card-view">
                                    <FreeMintCard />
                                </div>
                            }
                            <li className={`select-card-li ${active === 1 ? 'active-tab' : ''}`} onClick={() => {
                                setActive(1)
                                window.scrollTo({
                                    top: 100,
                                    behavior: 'smooth'
                                })
                            }}>
                                <p>INVITE</p>
                                <div className="ac-mask"></div>
                            </li>
                            {
                                active === 1 &&
                                <div className="card-view">
                                    <InviteCard />
                                </div>
                            }
                            <li className={`select-card-li ${active === 2 ? 'active-tab' : ''}`} onClick={() => {
                                setActive(2)
                                // window.scrollTo({
                                //     top:-200,
                                //     behavior:'smooth'
                                // })
                            }}>
                                <p>Rank</p>
                                <div className="ac-mask"></div>
                            </li>
                            {
                                active === 2 &&
                                <div className="card-view">
                                    <ActivityCard />
                                </div>
                            }
                        </ul>
                    </div>
                    {/* <div className="card-view">
                        {
                            active === 0 && <FreeMintCard /> ||
                            active === 1 && <InviteCard /> ||
                            active === 2 && <ActivityCard />
                        }
                    </div> */}
                </div>
                <p className="outside-remark">
                Note: VoiceNFT of Pizzap is currently issued on Plian Subchain 1. lf your $Pl on Plian Mainnet (from gate.io ) need to switch to Plian Subchain 1, please turn to <a target="_blank" href="https://wallet.plian.org/">https://wallet.plian.org/</a>.
                </p>
                {VERSION === 'new' && <FooterNew/>}
            </div>
        </div>
    )
};

export default AirdropView;