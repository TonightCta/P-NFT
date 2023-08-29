import { ReactElement, ReactNode, useContext } from "react";
import './index.scss'
import { Navigate, Outlet, useLocation } from "react-router-dom";
import HeaderWapper from "../../components/header";
import { PNft } from "../../App";
import { VERSION } from "../../utils/source";
import HeaderWapperNew from "../../components/header.new";

const IndexView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const location = useLocation();
    const private_r :string[] = ['/profile']
    return (
        <div className="index-view">
            {VERSION === 'new' ? <HeaderWapperNew/> : <HeaderWapper />}
            {
                !state.address && private_r.indexOf(location.pathname) > -1
                    ? <Navigate to="/"/>
                    : <Outlet />
            }
        </div>
    )
};

export default IndexView;