import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { useMetamask } from "../../utils/metamask";
import { PNft } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { Popover } from "antd";
import { Type } from "../../utils/types";

interface Menu {
    name: string,
    url: string
};

const Menu: Menu[] = [
    {
        name: 'Home',
        url: '/'
    },
    {
        name: 'VoiceNFT',
        url: '/voice-nft'
    },
    {
        name: 'Marketplace',
        url: '/market'
    },
    {
        name: 'Airdrop',
        url: '/airdrop'
    }
]

const HeaderWapper = (): ReactElement<ReactNode> => {
    const { connectMetamask } = useMetamask();
    const { state } = useContext(PNft);
    const [menuActive, setMenuActive] = useState<number>(0);
    const [line, setLine] = useState<string>('');
    const { dispatch } = useContext(PNft)
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        setLine(location.pathname !== '/' ? 'need-line' : '');
        switch (location.pathname) {
            case '/':
                setMenuActive(0);
                break;
            case '/voice-nft':
                setMenuActive(1);
                break;
            case '/market':
                setMenuActive(2);
                break;
            case '/airdrop':
                setMenuActive(3);
                break;
            default:
                setMenuActive(999);
        }
    }, [location.pathname]);
    const content = (
        <div className="pop-menu">
            <p onClick={() => {
                navigate('/owner')
            }}>My NFTs</p>
            <p onClick={() => {
                navigate('/profile')
            }}>Setting</p>
            <p onClick={() => {
                dispatch({
                    type: Type.SET_ADDRESS,
                    payload: {
                        address: ''
                    }
                });
                navigate('/')
            }}>Disconnect</p>
        </div>
    );
    return (
        <div className={`header-wapper ${line} ${state.screen_index !== 0 ? 'need-bg' : ''}`}>
            <div className="logo-menu">
                <p onClick={() => {
                    navigate('/')
                }}>
                    <img src={require('../../assets/images/logo.png')} alt="" />
                </p>
            </div>
            <ul className="h-menu">
                {
                    Menu.map((item: Menu, index: number): ReactElement => {
                        return (
                            <li key={index} className={`${menuActive === index ? 'active-menu' : ''}`} onClick={() => {
                                setMenuActive(index);
                                navigate(item.url)
                            }}>{item.name}</li>
                        )
                    })
                }
            </ul>
            {
                !state.address
                    ? <p className="connect-wallet" onClick={() => {
                        connectMetamask();
                    }}>Connect Wallet</p>
                    : <Popover content={content} title={null}>
                        <div className={`connect-wallet ${state.address ? 'w-200' : ''}`}>
                            <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                    </Popover>
            }
        </div>
    )
};

export default HeaderWapper;