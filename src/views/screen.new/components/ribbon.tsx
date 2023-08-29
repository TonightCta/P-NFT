import { ReactElement } from "react";
import IconFont from "../../../utils/icon";

const RibbonWapper = (): ReactElement => {
    return (
        <div className="ribbon-box">
            <div className="ribbon-1 ribbon-public">
                <ul>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8].map((item: number, index: number) => {
                            return (
                                <li key={index}>
                                    <IconFont type="icon-zixing" />
                                    <p>Pizzap AI Empowers Your Creative Inspiration</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="ribbon-2 ribbon-public">
                <ul>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8].map((item: number, index: number) => {
                            return (
                                <li key={index}>
                                    <IconFont type="icon-zixing" />
                                    <p>Pizzap AI Empowers Your Creative Inspiration</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default RibbonWapper;