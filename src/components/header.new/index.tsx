import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Popover } from "antd";
import IconFont from "../../utils/icon";
import { useMetamask } from "../../utils/metamask";
import { PNft } from "../../App";
import { calsAddress } from "../../utils";
import { Type } from "../../utils/types";

interface Menu {
    name: string,
    url: string
}

const MenuList: Menu[] = [
    {
        name: 'AI creation',
        url: '/voice-nft',
    },
    {
        name: 'Marketplace',
        url: '/marketplace',
    },
    {
        name: 'Gallery',
        url: '/gallery',
    },
    {
        name: 'Contest',
        url: '/contest',
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
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    useEffect(() => {
        switch (location.pathname) {
            case '/voice-nft':
                setActive(0);
                break;
            case '/marketplace':
                setActive(1);
                break;
            case '/gallery':
                setActive(2);
                break;
            case '/contest':
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
                    dispatch({
                        type: Type.SET_OWNER_ADDRESS,
                        payload: {
                            owner_address: state.address as string
                        }
                    })
                    navigate('/owner')
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
                                }}>{item.name}</li>
                            )
                        })
                    }
                </ul>
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
            </div>
        </div>
    )
};

export default HeaderWapperNew;