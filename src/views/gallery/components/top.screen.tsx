import { ReactElement } from "react";

const TopScreen = () : ReactElement => {
    return (
        <div className="top-screen">
            <div className="bg-box">
                <img src={require('../../../assets/images/test_bg.png')} alt="" />
                <div className="bg-mask"></div>
                <div className="linear-box"></div>
            </div>
            <div className="nft-inner-1">
                <div className="first-nft-msg">
                    <p className="nft-title">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        Trending Work
                    </p>
                    <div className="creator-msg">
                        <p className="creator-name">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                            Alex
                        </p>
                        <p className="creator-title">Crypto Kanji Gems</p>
                        <p className="creator-remark">The Cyclops Group is a group of artists, composers, cryptographers, and developers building networked narratives, collaborative games, and genre-bending experiences that embody the weirdness of the present. </p>
                    </div>
                </div>
                <div className="first-nft-pic">
                    <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                </div>
            </div>
        </div>
    )
};

export default TopScreen; 