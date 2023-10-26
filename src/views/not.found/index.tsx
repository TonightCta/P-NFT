import { ReactElement, ReactNode } from "react";
import './index.scss'
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const PageNotFound = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    return (
        <div className="not-found">
            <img src={require('../../assets/images/404.png')} alt="" />
            <p>SORRY,PAGE NOT FOUND</p>
            <p>
                <Button type="primary" onClick={() => {
                    navigate('/')
                }}>Back To Home</Button>
            </p>
        </div>
    )
};

export default PageNotFound;