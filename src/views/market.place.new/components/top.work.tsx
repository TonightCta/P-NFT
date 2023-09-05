import { ReactElement } from "react";
import WorkList from "./work.list";

const TopworkCard = (): ReactElement => {
    return (
        <div className="top-work-card">
            <p className="work-title">Top</p>
            <div className="work-inner">
                <div className="mask-work">
                    <p>Ranking is being calculated...</p>
                </div>
                <WorkList type={1} data={[]} />
                <WorkList type={2} data={[]} />
            </div>
        </div>
    )
};

export default TopworkCard;