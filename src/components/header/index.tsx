import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { useMetamask } from "../../utils/metamask";
import { PNft } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { Popover } from "antd";
import { Type } from "../../utils/types";
import { MenuOutlined } from "@ant-design/icons";
import MobileMenu from "./components/mobile.menu";
import DefaultAvatar from "../default_avatar/default.avatar";

export interface Menu {
    name: string,
    url: string
};

const MODE: string = process.env.REACT_APP_LAND as string;

const Menu: Menu[] = MODE === 'taiko'
    ? [
        {
            name: 'Create',
            url: '/create'
        },
        {
            name: 'Collections',
            url: '/collections'
        },
    ]
    : [
        {
            name: 'Create',
            url: '/create'
        },
        {
            name: 'Collections',
            url: '/collections'
        },
        {
            name: 'Airdrops',
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
    const [innerVisible, setInnerVisible] = useState<boolean>(false);
    useEffect(() => {
        setLine((location.pathname !== '/') ? 'need-line' : '');
        switch (location.pathname) {
            case '/create':
                setMenuActive(0);
                break;
            case '/collections':
                setMenuActive(1);
                break;
            case '/airdrop':
                setMenuActive(2);
                break;
            default:
                setMenuActive(999);
        }
    }, [location.pathname]);
    const content = (
        <div className="pop-menu">
            <p onClick={() => {
                // dispatch({
                //     type: Type.SET_OWNER_ADDRESS,
                //     payload: {
                //         owner_address: state.address as string
                //     }
                // })
                navigate(`/user/${state.address}`)
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
        <div className={`header-wapper ${location.pathname === '/airdrop' && 'need-blur'} ${location.pathname !== '/airdrop' && line} ${state.screen_index !== 0 ? 'need-bg' : ''}`}>
            <div className="logo-menu">
                <p onClick={() => {
                    navigate('/')
                }}>
                    <img src={require('../../assets/images/logo.png')} alt="" />
                </p>
                {line && <ul className="h-menu">
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
                </ul>}
            </div>
            <div className="pc-oper">
                {
                    !state.address
                        ? <p className="connect-wallet" onClick={() => {
                            connectMetamask();
                        }}>Connect Wallet</p>
                        : <Popover content={content} title={null}>
                            <div className={`connect-wallet ${state.address ? 'w-200' : ''}`}>
                                {state.account.avatar_url ? <img src={state.account.avatar_url} alt="" /> : <DefaultAvatar />}
                            </div>
                        </Popover>
                }
            </div>
            <div className="mobile-oper">
                {
                    location.pathname !== '/'
                        ? !state.address
                            ? <p className="connect-wallet" onClick={() => {
                                connectMetamask();
                            }}>Connect Wallet</p>
                            : <div className={`connect-wallet ${state.address ? 'w-200' : ''}`} onClick={() => {
                                setInnerVisible(true)
                            }}>
                                {state.account.avatar_url ? <img src={state.account.avatar_url} alt="" /> : <DefaultAvatar diameter={32}/>}
                            </div>
                        : <MenuOutlined onClick={() => {
                            setInnerVisible(true)
                        }} />
                }
            </div>
            <MobileMenu visible={innerVisible} close={(val: boolean) => {
                setInnerVisible(val)
            }} />
        </div>
    )
};

export default HeaderWapper;