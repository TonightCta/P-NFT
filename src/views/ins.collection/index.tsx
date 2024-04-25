import { ReactElement, ReactNode, useState } from "react";
import "./index.scss";
import Brc20Land from "./components/brc20";
import CollectionLand from "./components/collection";

interface Tab {
  title: string;
  type: number;
  disable: boolean;
}

const Tabs: Tab[] = [
  {
    title: "BRC20",
    type: 1,
    disable: false,
  },
  {
    title: "BLOB20",
    type: 2,
    disable: true,
  },
  {
    title: "Collections",
    type: 3,
    disable: false,
  },
];

const InsCollectionView = (): ReactElement<ReactNode> => {
  const [makeType, setMakeType] = useState<number>(3);
  return (
    <div className="ins-collection-view">
      <div className="mask-box">
        <img src={require("../../assets/images/ins_mask.png")} alt="" />
      </div>
      <div className="make-type">
        <ul>
          {Tabs.map((item: Tab, index: number) => {
            return (
              <li
                key={index}
                className={`${item.type === makeType ? "active-make" : ""} ${
                  item.disable ? "dis-tab" : ""
                }`}
                onClick={() => {
                  if (item.disable) return;
                  setMakeType(item.type);
                }}
              >
                <p>{item.title}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="ins-tab-card">
        {makeType === 1 ? <Brc20Land /> : <CollectionLand />}
      </div>
    </div>
  );
};

export default InsCollectionView;
