import { ReactElement, useEffect } from "react";
import { GetUrlKey } from "../../utils";


export const ToolView = (): ReactElement => {
    useEffect(() => {
        localStorage.setItem('oauth_token', GetUrlKey('oauth_token', window.location.href) as string);
        localStorage.setItem('oauth_verifier', GetUrlKey('oauth_verifier', window.location.href) as string);
        window.close();
    }, []);
    return (
        <div className="">
            <p style={{color:'white'}}>123123123123123</p>
        </div>
    )
};

export default ToolView;