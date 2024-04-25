import { ReactElement, ReactNode, useState } from "react";
import "./index.scss";
import IconFont from "../../utils/icon";
import FooterNew from "../screen.new/components/footer.new";
import BtcIns from "./components/btc";
import EvmIns from "./components/evm";

interface Tab {
  title: string;
  type: number;
}

const Tabs: Tab[] = [
  {
    title: "Bitcoin BRC20",
    type: 1,
  },
  {
    title: "EVM",
    type: 2,
  },
];

const InscribeView = (): ReactElement<ReactNode> => {
  const [makeType, setMakeType] = useState<number>(1);
  return (
    <div className="inscribe-view">
      <div className="mask-box">
        <img
          src={require("../../assets/new/voice_nft_mask.png")}
          className="left-mask"
          alt=""
        />
        <img
          src={require("../../assets/new/voice_nft_mask.png")}
          className="right-mask"
          alt=""
        />
      </div>
      <div className="inner-w-ins">
        <p className="page-icon">
          <IconFont type="icon-create-2" />
        </p>
        <p className="page-title">Inscribe</p>
        <p className="page-step">Inscriptions {`>`} Inscribe</p>
        <div className="make-type">
          <ul>
            {Tabs.map((item: Tab, index: number) => {
              return (
                <li
                  key={index}
                  className={`${item.type === makeType ? "active-make" : ""}`}
                  onClick={() => {
                    setMakeType(item.type);
                  }}
                >
                  <p>{item.title}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="make-inner">
          {makeType === 1 ? <BtcIns /> : <EvmIns />}
        </div>
      </div>
      <FooterNew />
    </div>
  );
};

export default InscribeView;
