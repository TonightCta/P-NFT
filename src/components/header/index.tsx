import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { useMetamask } from "../../utils/metamask";
import { PNft } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";

const HeaderWapper = (): ReactElement<ReactNode> => {
    const { connectMetamask } = useMetamask();
    const { state } = useContext(PNft);
    const [line,setLine] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        setLine(location.pathname !== '/' ? 'need-line' : '')
    },[location.pathname])
    return (
        <div className={`header-wapper ${line}`}>
            <p onClick={() => {
                navigate('/')
            }}>
                <img src={require('../../assets/images/logo.png')} alt="" />
            </p>
            <div className={`connect-wallet ${state.address ? 'w-200' : ''}`}>
                {
                    state.address && <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                }
                {
                    !state.address
                        ? <p onClick={() => {
                            connectMetamask();
                        }}>Connect Wallet</p>
                        : <p>{state.address?.substring(0, 6)}...{state.address?.substring(state.address.length - 6, state.address.length)}</p>
                }
            </div>
        </div>
    )
};

export default HeaderWapper;