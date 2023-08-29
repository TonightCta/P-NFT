import { Button } from "antd";
import { ReactElement } from "react";
import IconFont from '../../../utils/icon';

const ScreenIndexNew = (): ReactElement => {
    return (
        <div className="screen-index-new">
            <div className="left-top-mask"></div>
            <div className="left-text">
                <IconFont type="icon-zixing" className="star-1"/>
                <IconFont type="icon-zixing" className="star-2"/>
                <IconFont type="icon-zixing" className="star-3"/>
                <p>AI Empowers Your</p>
                <p>Creative</p>
                <p className="with-bg">Inspiration</p>
                <p>
                    <Button type="primary">Enter</Button>
                </p>
            </div>
            <div className="right-screen-banner">
                <div className="bottom-mask"></div>
                <ul>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item: number, index: number) => {
                            return (
                                <li key={index}>
                                    <img src={require('../../../assets/new/test_banner.png')} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item: number, index: number) => {
                            return (
                                <li key={index}>
                                    <img src={require('../../../assets/new/test_banner.png')} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item: number, index: number) => {
                            return (
                                <li key={index}>
                                    <img src={require('../../../assets/new/test_banner.png')} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default ScreenIndexNew;