import { ReactElement, ReactNode } from "react";
import FooterWapper from "../../../components/footer";

const VoicePool = (): ReactElement<ReactNode> => {
    return (
        <div className="voice-pool public-screen">
            <p className="public-title">VOICE POOL</p>
            <p className="pool-text more-top">
                {'Our plan is to create a human voice library within one year,which will feature a vast and comprehensive collection of unique human voices, spanning different languages and ages.'.toUpperCase()}
            </p>
            <p className="pool-text need-top">
                {'Participants in the Voice Pool should stake their NFTs, which will allow them to earn regular income.'.toUpperCase()}
            </p>
            <FooterWapper/>
        </div>
    )
};

export default VoicePool;