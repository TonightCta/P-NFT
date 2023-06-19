import { ReactElement,ReactNode } from "react";
import './index.scss'

const HeaderWapper = () : ReactElement<ReactNode> => {
    return (
        <div className="header-wapper">
            <p>
                <img src={require('../../assets/images/logo.png')} alt="" />
            </p>
            <p>Menu</p>
        </div>
    )
};

export default HeaderWapper;