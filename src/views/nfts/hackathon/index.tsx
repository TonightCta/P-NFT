import { ReactElement, useState } from "react";
import IconFont from "../../../utils/icon";
import HistoryTable from "./components/history";
import EntryTable from "./components/entry";
import HackathonTable from "./components/hackathon";
import BonusTable from "./components/bonus";

// interface Tab{
//     label:'Vote History' | 'Entry' | 'Hackathon' | 'Bonuscenter',
//     index:number
// };

// const Tabs:Tab[] = [
//     {
//         label:'Vote History',
//         index:1
//     }
// ]

const HackathonAssetsCard = (): ReactElement => {
  const [show, setShow] = useState<boolean>(true);
  const [active, setActive] = useState<number>(0);
  return (
    <div className="hackathon-assets-card">
      <div className={`left-tab ${!show ? "hide-tabs" : ""}`}>
        <div
          className="control-show"
          onClick={() => {
            setShow(!show);
          }}
        >
          <IconFont type="icon-a-lujing219" />
        </div>
        <ul>
          {["Vote History", "Entry", "Hackathon", "Bonuscenter"].map(
            (item: string, index: number) => {
              return (
                <li key={index} className={`${index === active ? 'active-tab' : ''}`} onClick={() => {
                    setActive(index)
                }}>
                  <p>{item}</p>
                </li>
              );
            }
          )}
        </ul>
      </div>
      <div className="right-table">
        {
            active === 0 && <HistoryTable/> ||
            active === 1 && <EntryTable/> ||
            active === 2 && <HackathonTable/> ||
            active === 3 && <BonusTable/> 
        }
      </div>
    </div>
  );
};

export default HackathonAssetsCard;
