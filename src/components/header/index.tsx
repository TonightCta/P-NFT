import { ReactElement,ReactNode } from "react";
import './index.scss'

const HeaderWapper = () : ReactElement<ReactNode> => {
    return (
        <div className="header-wapper">
            <p>Pizzap</p>
        </div>
    )
};

export default HeaderWapper;