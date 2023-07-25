import { ReactElement, ReactNode } from "react";
import './index.scss'

const MaskCard = (): ReactElement<ReactNode> => {
    return (
        <div className="mask-card">
            <img src={require('../../assets/images/voice_nft_mask_1.png')} className="mask-public mask-1" alt="" />
            <img src={require('../../assets/images/voice_nft_mask_2.png')} className="mask-public mask-2" alt="" />
            <img src={require('../../assets/images/voice_nft_mask_3.png')} className="mask-public mask-3" alt="" />
        </div>
    )
};

export default MaskCard;