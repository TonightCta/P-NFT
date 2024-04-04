import { ReactElement, ReactNode } from "react";
import IconFont from "../../../utils/icon";


interface Account {
    icon: string,
    url: string
};

const SideList: Account[] = [
    {
        icon: 'icon-github',
        url: 'https://github.com/Pizzap-io'
    },
    {
        icon: 'icon-telegram1',
        url: 'http://t.me/pizzap_io'
    },
    {
        icon: 'icon-twitter-fill',
        url: 'https://twitter.com/pizzap_io'
    },
    {
        icon: 'icon-medium1',
        url: 'https://medium.com/@Pizzap_io'
    },
    {
        icon: 'icon-discord1',
        url: 'http://discord.gg/eATngqtx3m'
    }
]

const FooterNew = (): ReactElement<ReactNode> => {
    return (
        <div className="footer-wapper-new">
            <div className="left-msg">
                <img src={require('../../../assets/new/logo.png')} alt="" />
                <p>Copyright © 2024 Pizzap.All Rights Reserved.</p>
            </div>
            <div className="right-account">
                <ul>
                    {
                        SideList.map((item: Account, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    window.open(item.url)
                                }}>
                                    <IconFont type={item.icon} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default FooterNew;