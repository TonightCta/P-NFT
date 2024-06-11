import { ReactElement, ReactNode } from "react";
// import { SwapWidget } from "@uniswap/widgets";
// import "@uniswap/widgets/fonts.css";
import "./index.scss";

const SwapIndex = () : ReactElement<ReactNode> => {
    return (
        <div className="swap-index">
            <p>Swap Index</p>
            {/* <SwapWidget/> */}
        </div>
    )
};
// function SwapIndex() {
//   <div className="Uniswap">
//     <SwapWidget />
//   </div>;
// }

export default SwapIndex;
