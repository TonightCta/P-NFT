import { ReactElement, useState } from "react";

const FixedTabIndex = (): ReactElement => {
    const [active, setActive] = useState<number>(0);
    return (
        <div className="fixed-tab-index">
            <ul>
                {
                    ['HOME', 'AI BUILDING', 'VISIONMAP', 'TRAFFIC OF VOICENFT', 'VOICE POOL'].map((item: string, index: number) => {
                        return (
                            <li key={index} className={`${active === index ? 'active-tab' : ''}`} onClick={() => {
                                setActive(index)
                            }}>
                                <p className="active-line"></p>
                                {item}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default FixedTabIndex;