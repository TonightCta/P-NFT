import { ReactElement, ReactNode } from "react";
import './index.scss';
import IconFont from "../../utils/icon";

interface Tab {
    icon: ReactNode,
    url: string
}

const FooterWapper = (): ReactElement<ReactNode> => {
    const tab: Tab[] = [
        {
            icon: <IconFont type="icon-github-fill" />,
            url: 'https://github.com/Pizzap-io'
        },
        {
            icon: <IconFont type="icon-telegram" />,
            url: 'http://t.me/pizzap_io'
        },
        {
            icon: <IconFont type="icon-tuitetwitter43" />,
            url: 'https://twitter.com/pizzap_io'
        },
        {
            icon: <IconFont type="icon-medium-circle-fill" />,
            url: 'https://medium.com/@Pizzap_io'
        },
        {
            icon: <IconFont type="icon-discord" color="red"/>,
            url: 'http://discord.gg/eATngqtx3m'
        }
    ]
    return (
        <div className="footer-wapper">
            <p>Copyright © 2024 Pizzap.All Rights Reserved.</p>
            <ul>
                {
                    tab.map((item: Tab, index: number): ReactElement => {
                        return (
                            <li key={index} onClick={() => {
                                window.open(item.url)
                            }}>
                                {item.icon}
                                {/* <img src={item.icon} alt="" /> */}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default FooterWapper;