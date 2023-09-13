import { ReactElement, useState } from "react";
import BasicBox from "./basic.box";
import AigcBox from "./aigc.box";

const DesignBox = (props:{upDateBack:() => void}): ReactElement => {
    const [active, setActive] = useState<number>(0);
    return (
        <div className="design-box">
            <div className="back-btn" onClick={() => {
                props.upDateBack()
            }}>
                <img src={require('../../../assets/new/next_right.png')} alt="" />
            </div>
            <div className="left-menu">
                <ul>
                    {
                        ['Basic', 'AIGC'].map((item: string, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    setActive(index)
                                }} className={`${active === index ? 'active-menu' : ''}`}>
                                    <p>{item}</p>
                                    <p className="line"></p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="right-view">
                {
                    active === 0
                        ? <BasicBox />
                        : <AigcBox />
                }
            </div>
        </div>
    )
};

export default DesignBox;