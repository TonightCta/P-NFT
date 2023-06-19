import { ReactElement } from "react";

const CardItem = (): ReactElement => {
    return (
        <div className="market-card">
            <div className="img-box">
                <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
            </div>
            <p className="card-type">BabyBunny</p>
            <div className="other-msg">
                <p>XXXX #0001</p>
                <p>2.5BTC</p>
            </div>
        </div>
    )
};

export default CardItem;