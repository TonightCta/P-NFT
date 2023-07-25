import { ReactElement } from "react";
import "../../../assets/css/loader.css"

const Recording = (): ReactElement => {
    return (
        <div className="loading">
            <div className="flex-box">
                <div className="loader-inner line-scale-pulse-out-rapid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
};

export default Recording;