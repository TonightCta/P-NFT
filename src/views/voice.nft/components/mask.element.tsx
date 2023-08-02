import { ReactElement } from "react";

const MaskElement = () : ReactElement => {
    return (
        <div className="mask-element">
            <img src={require('../../../assets/images/ai_bg_icon_1.png')} alt="" className="public-mask-ele ele-1"/>
            <img src={require('../../../assets/images/ai_bg_icon_2.png')} alt="" className="public-mask-ele ele-2"/>
            <img src={require('../../../assets/images/ai_bg_icon_3.png')} alt="" className="public-mask-ele ele-3"/>
            <img src={require('../../../assets/images/ai_bg_icon_4.png')} alt="" className="public-mask-ele ele-4"/>
            <img src={require('../../../assets/images/ai_bg_icon_5.png')} alt="" className="public-mask-ele ele-5"/>
            <img src={require('../../../assets/images/ai_bg_icon_6.png')} alt="" className="public-mask-ele ele-6"/>
            <img src={require('../../../assets/images/ai_bg_icon_7.png')} alt="" className="public-mask-ele ele-7"/>
        </div>
    )
};
export default MaskElement;