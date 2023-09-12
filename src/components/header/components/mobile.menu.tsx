import { Button, Drawer } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { PNft } from "../../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "..";
import { calsAddress } from "../../../utils";
import { PoweroffOutlined } from "@ant-design/icons";
import { Type } from "../../../utils/types";
import { useMetamask } from "../../../utils/metamask";
import DefaultAvatar from "../../default_avatar/default.avatar";

interface Props {
    visible: boolean,
    close: (val: boolean) => void
}

const RouteList: Menu[] = [
    {
        name: 'AI creation',
        url: '/voice-nft'
    },
    {
        name: 'Marketplace',
        url: '/marketplace'
    },
    {
        name: 'Airdrops',
        url: '/airdrop'
    },
    {
        name: 'My NFTs',
        url: '/owner'
    },
    {
        name: 'Settings',
        url: '/profile'
    }
];
const RouteSide: Menu[] = [
    {
        name: 'Home',
        url: ''
    },
    {
        name: 'AI BUILDING',
        url: ''
    },
    {
        name: 'VISIONMAP',
        url: ''
    },
    {
        name: 'VOICE POOL',
        url: ''
    },
]

const MobileMenu = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const { state, dispatch } = useContext(PNft);
    const { connectMetamask } = useMetamask();
    const navigate = useNavigate();
    const location = useLocation();
    const onClose = () => {
        setVisible(false);
        props.close(false)
    };
    useEffect(() => {
        props.visible && setVisible(props.visible)
    }, [props.visible])
    return (
        <Drawer
            title={null}
            placement="right"
            onClose={onClose}
            open={visible}
            key="right"
            zIndex={2000}
            closable={false}
            width={'60%'}
        >
            <div className="inner-menu">
                <div className="top-inner">
                    {state.address && <div className="account-msg" onClick={() => {
                        setVisible(false);
                        props.close(false);
                        navigate('/owner')
                    }}>
                        <div className="left-msg">
                            <p>{state.account.user_name ? state.account.user_name : 'unknow'}</p>
                            <p>{calsAddress(state.address as string)}</p>
                        </div>
                        <div className="right-avatar">
                            {state.account.avatar_url ? <img src={state.account.avatar_url} alt="" /> : <DefaultAvatar diameter={36}/>}
                        </div>
                    </div>
                    }
                    <div className="route-list">
                        <ul>
                            {
                                (location.pathname === '/' ? RouteSide : RouteList).map((item: Menu, index: number): ReactElement => {
                                    return (
                                        <li key={index} onClick={location.pathname === '/' ? () => {
                                            setVisible(false);
                                            props.close(false);
                                            state.swiper_ref.slideTo(index)
                                        } : () => {
                                            setVisible(false);
                                            props.close(false);
                                            navigate(item.url)
                                        }}>{item.name}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="login-out">
                    {state.address
                        ? <Button className="login-out" onClick={() => {
                            setVisible(false);
                            props.close(false);
                            dispatch({
                                type: Type.SET_ADDRESS,
                                payload: {
                                    address: ''
                                }
                            });
                            navigate('/')
                        }}>
                            <PoweroffOutlined />
                            Disconnect
                        </Button>
                        : <Button type="primary" onClick={() => {
                            connectMetamask();
                        }}>Connect Wallet</Button>
                    }
                </div>
            </div>
        </Drawer>
    )
};

export default MobileMenu;