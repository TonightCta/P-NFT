import { ReactElement, ReactNode, useContext } from "react";
import './index.scss'
import { Navigate, Outlet, useLocation } from "react-router-dom";
import HeaderWapper from "../../components/header";
import { PNft } from "../../App";

const IndexView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const location = useLocation();
    const private_r :string[] = ['/profile','/owner']
    return (
        <div className="index-view">
            <HeaderWapper />
            {
                !state.address && private_r.indexOf(location.pathname) > -1
                    ? <Navigate to="/"/>
                    : <Outlet />
            }
        </div>
    )
};

export default IndexView;