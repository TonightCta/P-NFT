import { ReactElement } from "react";
import './test.scss'


const TestProgress = (): ReactElement => {
    const renderRightRate = (rate: number) => {
        if (rate < 50) {
            return {
                trans: 'rotate(' + 3.6 * rate + 'deg)',
                color: ''
            };
        } else {
            return {
                trans: 'rotate(0)',
                color: '#FA3370'
            };
        }
    };

    const renderLeftRate = (rate: number) => {
        if (rate >= 50) {
            return 'rotate(' + 3.6 * (rate - 50) + 'deg)';
        }
    };
    return (
        <div className="circle">
            <div className="circle_left ab" style={{ transform: renderLeftRate(55) }}></div>
            <div className="circle_right ab" style={{ transform: renderRightRate(55).trans, borderColor: renderRightRate(55).color }}></div>
            <div className="circle_text">
                <span className="name">成功率</span>
                <span className="value">85%</span>
            </div>
        </div>
    )
};

export default TestProgress;