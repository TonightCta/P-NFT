import { ReactElement, ReactNode } from "react";
import IconFont from "../../../utils/icon";

interface Account {
    icon: string,
    url: string
};

const SideList: Account[] = [
    {
        icon: 'icon-github',
        url: ''
    },
    {
        icon: 'icon-telegram1',
        url: ''
    },
    {
        icon: 'icon-twitter-fill',
        url: ''
    },
    {
        icon: 'icon-medium1',
        url: ''
    },
    {
        icon: 'icon-discord1',
        url: ''
    }
]

const FooterNew = (): ReactElement<ReactNode> => {
    return (
        <div className="footer-wapper-new">
            <div className="left-msg">
                <img src={require('../../../assets/new/logo.png')} alt="" />
                <p>Copyright © 2023 Pizzap.All Rights Reserved.</p>
            </div>
            <div className="right-account">
                <ul>
                    {
                        SideList.map((item: Account, index: number) => {
                            return (
                                <li key={index}>
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