import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Popover } from "antd";
import IconFont from "../../utils/icon";
import { useMetamask } from "../../utils/metamask";
import { PNft } from "../../App";
import { FilterAddress, calsAddress } from "../../utils";
import { Type } from "../../utils/types";
import { Config, NetworkConfig, flag } from "../../utils/source";
import { MenuOutlined } from "@ant-design/icons";
import MobileMenuDraw from "./components/mobile.menu";
import { useSwitchChain } from "../../hooks/chain";

export interface Menu {
    name: string,
    url: string
}

export const MenuList: Menu[] = [
    {
        name: 'Create',
        url: '/create',
    },
    {
        name: 'Collections',
        url: '/collections',
    },
    {
        name: 'Gallery',
        url: '/gallery',
    },
    {
        name: 'Campaigns',
        url: '/campaigns',
    },
    {
        name: 'Airdrops',
        url: '/airdrop',
    },
]

const HeaderWapperNew = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    const { connectMetamask } = useMetamask();
    const { state, dispatch } = useContext(PNft);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { switchC } = useSwitchChain();
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);
    const [chainPop, setChainPop] = useState<boolean>(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen: boolean) => {
        if (flag) {
            setOpen(false);
            return
        }
        setOpen(newOpen);
    };
    useEffect(() => {
        switch (location.pathname) {
            case '/create':
                setActive(0);
                break;
            case '/collections':
                setActive(1);
                break;
            case '/gallery':
                setActive(2);
                break;
            case '/campaigns':
                setActive(3);
                break;
            case '/airdrop':
                setActive(4);
                break;
            default:
                setActive(99)
        }
    }, [location.pathname])
    const [active, setActive] = useState<number>(99);
    const content = (
        <div className="connect-menu" onClick={hide}>
            <ul>
                <li onClick={() => {
                    // dispatch({
                    //     type: Type.SET_OWNER_ADDRESS,
                    //     payload: {
                    //         owner_address: state.address as string
                    //     }
                    // })
                    // navigate('/owner');
                    navigate(`/user/${state.address}`)
                }}>My NFTs</li>
                <li onClick={() => {
                    navigate('/profile')
                }}>Setting</li>
                <li onClick={() => {
                    dispatch({
                        type: Type.SET_ADDRESS,
                        payload: {
                            address: ''
                        }
                    });
                    navigate('/')
                }}>Disconnect</li>
            </ul>
        </div>
    )
    const chainContent = (
        <div className="connect-menu connect-menu-chain" onClick={() => {
            setChainPop(false)
        }}>
            <ul>
                {
                    NetworkConfig.map((item: Config, index: number) => {
                        return (
                            <li key={index} onClick={() => {
                                switchC(+item.chain_id)
                            }}>
                                <img src={item.chain_logo} alt="" />
                                {item.chain_name}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
    return (
        <div className="header-wapper-new">
            <img src={require('../../assets/new/logo.png')} alt="" className="left-logo" onClick={() => {
                navigate('/')
            }} />
            <div className="right-menu">
                <ul>
                    {
                        MenuList.map((item: Menu, index: number) => {
                            return (
                                <li className={`${index === active ? 'active-menu' : ''}`} key={index} onClick={() => {
                                    setActive(index);
                                    navigate(item.url)
                                }}>
                                    {item.name}
                                    {item.name === 'Campaigns' && <img src={require('../../assets/images/fire.gif')} alt="" />}
                                    {item.name === 'Create' && <img src={require('../../assets/images/ai.gif')} alt="" className="ai-i"/>}
                                </li>
                            )
                        })
                    }
                </ul>
                <Popover open={chainPop} onOpenChange={(e: boolean) => {
                    setChainPop(e)
                }} content={chainContent} title={null} trigger="click">
                    <div className="connect-box select-chain">
                        <div className="connected-box">
                            <img src={FilterAddress(state.chain as string).chain_logo} alt="" />
                            <IconFont type="icon-xiangxia" />
                        </div>
                    </div>
                </Popover>
                <div className="connect-box">
                    {!state.address
                        ? <Button type="default" onClick={() => {
                            connectMetamask();
                        }}>
                            <IconFont type="icon-wallet" />
                            Connect Wallet
                        </Button>
                        : <Popover open={open} onOpenChange={handleOpenChange} content={content} title={null} trigger="click">
                            <div className="connected-box">
                                <img src={state.account.avatar_url} alt="" />
                                <p>{calsAddress(state.address)}</p>
                                <div className="arrow-box">
                                    <IconFont type="icon-xiangxia" />
                                </div>
                            </div>
                        </Popover>
                    }
                </div>
                <div className="mobile-menu">
                    <MenuOutlined onClick={() => {
                        setMobileMenu(true)
                    }} />
                    <MobileMenuDraw visible={mobileMenu} closeDraw={(val: boolean) => {
                        setMobileMenu(val);
                    }} />
                </div>
            </div>
        </div>
    )
};

export default HeaderWapperNew;