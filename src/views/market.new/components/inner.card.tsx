import { Button } from "antd";
import { ReactElement } from "react";


const InnerCard = (): ReactElement => {
    return (
        <div className="inner-card">
            <div className="nft-box">
                <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                <div className="nft-tag">
                    <img src={require('../../../assets/new/plian_logo.png')} alt="" />
                </div>
            </div>
            <div className="msg-box">
                <p className="nft-name">A fashion girl #0098</p>
                <p className="price-text">0.0289&nbsp;ETH</p>
                <p className="last-price">Last sale:{`<`}0.02 ETH</p>
            </div>
            <p className="oper-btn">
                <Button type="primary">Buy now</Button>
            </p>
        </div>
    )
};

export default InnerCard;