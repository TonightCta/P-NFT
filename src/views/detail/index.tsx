import { ReactElement, ReactNode, useState } from "react";
import './index.scss'
import TabList from "./components/tab.list";
import FixedModal from "./components/fixed.price";
import { Button } from "antd";
import VerifyModal from "./components/verify.address";

const DetailView = (): ReactElement<ReactNode> => {
    const [active, setActive] = useState<number>(0);
    const [fixedVisible,setFixedVisible] = useState<boolean>(false);
    const [virifyVisible,setVerifyVisible] = useState<boolean>(false);
    return (
        <div className="detail-view">
            <div className="nft-msg">
                <div className="left-nft-box">
                    <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                </div>
                <div className="right-nft-msg">
                    <p className="msg-name">
                        <img src={require('../../assets/images/favicon.png')} alt="" />
                        BabyBunny
                    </p>
                    <p className="nft-num">#876384</p>
                    <p className="nft-remark">Owner by <span>0x0000...0000</span></p>
                    <div className="edit-box">
                        <div className="inner-top">
                            <div className="price-msg">
                                <p>2.1&nbsp;BTC</p>
                                <p>Price($64,567.12)</p>
                            </div>
                            <div className="btn-oper">
                                <Button onClick={() => {
                                    setFixedVisible(true);
                                }}>Change&nbsp;Price</Button>
                                <p><span>Cancel</span> the listing</p>
                            </div>
                        </div>
                        <div className="msg-switch">
                            <div className="msg-tabs">
                                <ul>
                                    {
                                        ['Attributes', 'Info'].map((item: string, index: number): ReactElement => {
                                            return (
                                                <li key={index} className={`${active === index ? 'active-tab-msg' : ''}`} onClick={() => {
                                                    setActive(index)
                                                }}>{item}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <ul className="msg-list">
                                <li>
                                    <p>CONTRACT</p>
                                    <p>0x0000...0000</p>
                                </li>
                                <li>
                                    <p>TOKEN ID</p>
                                    <p>0001</p>
                                </li>
                                <li>
                                    <p>BLOCKCHAIN</p>
                                    <p>Plian Mainnet Subchain 1</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
            <div className="list-filter">
                <div className="tab-btn">
                    <ul>
                        <li>Activities</li>
                    </ul>
                </div>
                <div className="search-inp">
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <TabList />
            {/* 设置价格 */}
            <FixedModal visible={fixedVisible} closeModal={(val:boolean) => {
                setFixedVisible(val);
            }}/>
            {/* 验证地址 */}
            <VerifyModal visible={virifyVisible} closeModal={(val:boolean) => {
                setVerifyVisible(val)
            }}/>
        </div>
    )
};

export default DetailView;