import { ReactElement } from "react";
import { Pagination } from 'antd';

const TabList = (): ReactElement => {
    return (
        <div className="tab-list">
            <div className="list-content">
                <div className="content-title">
                    <ul>
                        <li>Type</li>
                        <li>Item</li>
                        <li>Price</li>
                        <li>From</li>
                        <li>To</li>
                        <li>Date</li>
                    </ul>
                </div>
                <div className="content-data">
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item: number, index: number): ReactElement => {
                            return (
                                <ul key={index}>
                                    <li>
                                        <p>Listing</p>
                                        <p className="color-g">as fixed price</p>
                                    </li>
                                    <li>
                                        <div className="with-img">
                                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                                            <div className="name-msg">
                                                <p className="color-g">Baby Bunny</p>
                                                <p>*****</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <p>$64321.12</p>
                                        <p className="color-g">2.1&nbsp;BTC</p>
                                    </li>
                                    <li>
                                        <p>0x0000....0000</p>
                                    </li>
                                    <li>
                                        <p>0x0000....0000</p>
                                    </li>
                                    <li>
                                        <p className="color-g">35 minutes ago</p>
                                    </li>
                                </ul>
                            )
                        })
                    }
                </div>
            </div>
            <div className="page-oper">
                <Pagination defaultCurrent={1} total={50} onChange={() => {
                    window.scrollTo({
                        top:700,
                        behavior:'smooth'
                    })
                }}/>
            </div>
        </div>
    )
};

export default TabList;