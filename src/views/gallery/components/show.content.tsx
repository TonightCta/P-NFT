import { ReactElement } from "react";
import Content3 from "./content.3";

const ShowContent = (): ReactElement => {
    return (
        <div className="show-content">
            <p className="content-title">
                <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                Editor's Picks
            </p>
            <div className="content-1">
                <ul>
                    {
                        [1, 2, 3].map((item: number, index: number) => {
                            return (
                                <li key={index}>
                                    <div className="nft-box">
                                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                    </div>
                                    <p className="nft-name">Flourish</p>
                                    <div className="minter-msg">
                                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                        <p>Alex</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="content-2">
                <div className="content-2-inner">
                    <div className="left-msg">
                        <div className="creator-msg">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                            Ben Benhorin
                        </div>
                        <p className="msg-title">INSIDE ME</p>
                        <p className="msg-remark">The Cyclops Group is a group of artists, composers, cryptographers, and developers building networked narratives, collaborative games, and genre-bending experiences that embody the weirdness of the present. </p>
                    </div>
                    <div className="nft-box">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                    </div>
                </div>
            </div>
            <Content3/>
        </div>
    )
};

export default ShowContent;