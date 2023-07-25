import { ReactElement, ReactNode } from "react";
import FooterWapper from "../../../components/footer";

const VoicePool = (): ReactElement<ReactNode> => {
    return (
        <div className="voice-pool public-screen">
            <p className="public-title">VOICE POOL</p>
            <p className="pool-text more-top">
                {'Voice Pool is a collection of VoiceNFTs on Pizzap, created and owned by DAO members. Creators often contribute by uploading their personal Voice works, which are typically created using AI tools introduced by Pizzap. Voicework is showcased and traded on the Marketplace in Pizzap.'.toUpperCase()}
            </p>
            <p className="pool-text need-top">
                {'With the improvement of Pizzap NFTFi, the liquidity of NFT assets will gradually increase. VoiceNFTs from the Voice Pool will have more practical applications in the later stages of the Pizzap MetaVerse. The Creator Economy and AIGC ecosystem in PizzapDAO will thrive through the Voice Pool.'.toUpperCase()}
            </p>
            <FooterWapper/>
        </div>
    )
};

export default VoicePool;