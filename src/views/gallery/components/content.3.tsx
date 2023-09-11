import { ReactElement } from "react";

const Content3 = (): ReactElement => {
    return (
        <div className="content-3">
            <div className="left-list">
                <div className="right-down">
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                        <p className="nft-name">Flourish</p>
                        <div className="minter-msg">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                            <p>Ben Benhorin</p>
                        </div>
                        <p className="nft-remark">Ben Benhorin is a digital artist, designer & educator based in Tel Aviv.</p>
                    </div>
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                        <p className="nft-name">Flourish</p>
                        <div className="minter-msg">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                            <p>Ben Benhorin</p>
                        </div>
                        <p className="nft-remark">Ben Benhorin is a digital artist, designer & educator based in Tel Aviv.</p>
                    </div>
                </div>
                <div className="public-card w-width">
                    <div className="nft-box">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                    </div>
                    <p className="nft-name">Flourish</p>
                    <div className="minter-msg">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        <p>Ben Benhorin</p>
                    </div>
                    <p className="nft-remark">Ben Benhorin is a digital artist, designer & educator based in Tel Aviv.</p>
                </div>
                <div className="left-down">
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                        <p className="nft-name">Flourish</p>
                        <div className="minter-msg">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                            <p>Ben Benhorin</p>
                        </div>
                        <p className="nft-remark">Ben Benhorin is a digital artist, designer & educator based in Tel Aviv.</p>
                    </div>
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                        <p className="nft-name">Flourish</p>
                        <div className="minter-msg">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                            <p>Ben Benhorin</p>
                        </div>
                        <p className="nft-remark">Ben Benhorin is a digital artist, designer & educator based in Tel Aviv.</p>
                    </div>
                </div>
                <div className="public-card r-w-width">
                    <div className="nft-box">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                    </div>
                    <p className="nft-name">Flourish</p>
                    <div className="minter-msg">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        <p>Ben Benhorin</p>
                    </div>
                    <p className="nft-remark">Ben Benhorin is a digital artist, designer & educator based in Tel Aviv.</p>
                </div>
                <div className="public-card last-card">
                    <div className="nft-box">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                    </div>
                    <p className="nft-name">Flourish</p>
                    <div className="minter-msg">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        <p>Ben Benhorin</p>
                    </div>
                    <p className="nft-remark">Ben Benhorin is a digital artist, designer & educator based in Tel Aviv.</p>
                </div>
            </div>
            <div className="right-list">
                <div className="trending-list">
                    <p className="public-title">Trending Artists</p>
                    <ul className="public-list">
                        {
                            [1, 2, 3, 4, 5].map((item: number, index: number) => {
                                return (
                                    <li key={index}>
                                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                        <p>Marquez</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="collection-list">
                    <p className="public-title">Top Collectors</p>
                    <ul className="public-list">
                        {
                            [1, 2, 3, 4, 5].map((item: number, index: number) => {
                                return (
                                    <li key={index}>
                                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                        <p>Marquez</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="series-list">
                    <p>Series</p>
                    <ul className="public-card-list">
                        {
                            [1, 2, 3].map((item: number, index: number) => {
                                return (
                                    <li key={index}>
                                        <div className="nft-box">
                                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                        </div>
                                        <p>Fragmentation</p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Content3;