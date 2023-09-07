import { ReactElement } from "react";
import IconFont from "../../../utils/icon";

const MsgCard = (props: { about: string, description: string }): ReactElement => {
    return (
        <div className="msg-card">
            <div className="public-msg-s">
                <p className="msg-title">
                    <IconFont type="icon-timer" />
                    About
                </p>
                <div className="msg-text">
                    <p>{props.about}</p>
                </div>
            </div>
            <div className="public-msg-s">
                <p className="msg-title">
                    <IconFont type="icon-timer" />
                    Description
                </p>
                <div className="msg-text">
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
    )
};


export default MsgCard;