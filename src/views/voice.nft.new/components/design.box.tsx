import { ReactElement, useState } from "react";
import BasicBox from "./basic.box";
import AigcBox from "./aigc.box";
import { Input } from "..";
import IconFont from "../../../utils/icon";

interface Props {
    info: Input,
    upDateBack: () => void
}

const DesignBox = (props: Props): ReactElement => {
    const [active, setActive] = useState<number>(0);
    return (
        <div className="design-box">
            <div className="back-btn" onClick={() => {
                props.upDateBack()
            }}>
                <IconFont type="icon-jiantou"/>
                <IconFont type="icon-jiantou"/>
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
                        ? <BasicBox info={props.info}/>
                        : <AigcBox info={props.info}/>
                }
            </div>
        </div>
    )
};

export default DesignBox;