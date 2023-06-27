import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { useMetamask } from "../../utils/metamask";
import { PNft } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { Popover } from "antd";
import { Type } from "../../utils/types";

const HeaderWapper = (): ReactElement<ReactNode> => {
    const { connectMetamask } = useMetamask();
    const { state } = useContext(PNft);
    const [line, setLine] = useState<string>('');
    const { dispatch } = useContext(PNft)
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        setLine(location.pathname !== '/' ? 'need-line' : '')
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
    )
    return (
        <div className={`header-wapper ${line}`}>
            <p onClick={() => {
                navigate('/')
            }}>
                <img src={require('../../assets/images/logo.png')} alt="" />
            </p>

            {
                !state.address
                    ? <p className="connect-wallet" onClick={() => {
                        connectMetamask();
                    }}>Connect Wallet</p>
                    : <Popover content={content} title={null}>
                        <div className={`connect-wallet ${state.address ? 'w-200' : ''}`} onClick={() => {
                            navigate('/profile')
                        }}>
                            <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                    </Popover>
            }
        </div>
    )
};

export default HeaderWapper;