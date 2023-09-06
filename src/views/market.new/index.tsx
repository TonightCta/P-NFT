import { ReactElement, ReactNode } from "react";
import './index.scss'
import ListCard from "./components/list.card";
import IconFont from "../../utils/icon";

interface Account {
    icon: string,
    url: string
};

const SideList: Account[] = [
    {
        icon: 'icon-globe-simple-bold',
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

const MarketViewNew = (): ReactElement<ReactNode> => {
    return (
        <div className="market-view-new">
            <div className="bg-box">
                <img src={require('../../assets/images/test_bg.png')} alt="" />
            </div>
            <div className="content-box">
                <div className="collection-logo">
                    <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                </div>
                <div className="collection-name">
                    <p>PAI SPACE</p>
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
                <p className="collection-owner">By Pizzap</p>
                <div className="collection-total">
                    <p>Total items<span>6.1M</span></p>
                    <p>Created<span>Mar 2021</span></p>
                    <p>Creator earnings<span>10%</span></p>
                    <p>Chain<span>Plian</span></p>
                    <p>Category<span>Gaming</span></p>
                </div>
                <p className="unknow-text">Sci-fi collectable card game with NFTs</p>
                <ListCard />
            </div>
        </div>
    )
};


export default MarketViewNew;