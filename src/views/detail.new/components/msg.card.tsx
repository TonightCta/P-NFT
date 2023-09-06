import { ReactElement } from "react";
import IconFont from "../../../utils/icon";

const MsgCard = (): ReactElement => {
    return (
        <div className="msg-card">
            <div className="public-msg-s">
                <p className="msg-title">
                    <IconFont type="icon-timer" />
                    About
                </p>
                <div className="msg-text">
                    <p>PAI Space is a collection of Pizzap AI Creating, co-owned and managed by PizzapDAO Members. Creators should use Pizzap AI creating tools to create, which currently support the creation of pictures, copywriting, and voice.</p>
                </div>
            </div>
            <div className="public-msg-s">
                <p className="msg-title">
                    <IconFont type="icon-timer" />
                    About
                </p>
                <div className="msg-text">
                    <p>PAI Space is a collection of Pizzap AI Creating, co-owned and managed by PizzapDAO Members. Creators should use Pizzap AI creating tools to create, which currently support the creation of pictures, copywriting, and voice.</p>
                </div>
            </div>
        </div>
    )
};


export default MsgCard;