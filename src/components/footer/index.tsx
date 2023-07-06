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
            url: ''
        },
        {
            icon: <IconFont type="icon-telegram" />,
            url: ''
        },
        {
            icon: <IconFont type="icon-tuitetwitter43" />,
            url: ''
        },
        {
            icon: <IconFont type="icon-medium-circle-fill" />,
            url: ''
        },
        {
            icon: <IconFont type="icon-discord" color="red"/>,
            url: ''
        }
    ]
    return (
        <div className="footer-wapper">
            <ul>
                {
                    tab.map((item: Tab, index: number): ReactElement => {
                        return (
                            <li key={index}>
                                {item.icon}
                                {/* <img src={item.icon} alt="" /> */}
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