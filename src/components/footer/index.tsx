import { ReactElement, ReactNode } from "react";
import './index.scss';

interface Tab {
    icon: string,
    url: string
}

const FooterWapper = (): ReactElement<ReactNode> => {
    const tab: Tab[] = [
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        },
        {
            icon: require('../../assets/images/WechatIMG20.jpeg'),
            url: ''
        }
    ]
    return (
        <div className="footer-wapper">
            <ul>
                {
                    tab.map((item:Tab,index:number) : ReactElement => {
                        return (
                            <li key={index}>
                                <img src={item.icon} alt="" />
                            </li>
                        )
                    })
                }
            </ul>
            <p>Copyright © 2023 Pizzap.All Rights Reserved.</p>
        </div>
    )
};

export default FooterWapper;