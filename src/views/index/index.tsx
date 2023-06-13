import { ReactElement,ReactNode } from "react";
import './index.scss'
import { Outlet } from "react-router-dom";
import HeaderWapper from "../../components/header";

const IndexView = () : ReactElement<ReactNode> => {
    return (
        <div className="index-view">
            <HeaderWapper/>
            <Outlet/>
        </div>
    )
};

export default IndexView;