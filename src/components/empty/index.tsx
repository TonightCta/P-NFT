import { ReactElement,ReactNode } from "react";
import './index.scss'

const EmptyCard = () : ReactElement<ReactNode> => {
    return (
        <div className="empty-card">
            <img src={require('../../assets/images/no_more.gif')} alt="" />
            <p>It is all, nothing more</p>
        </div>
    )
};

export default EmptyCard;