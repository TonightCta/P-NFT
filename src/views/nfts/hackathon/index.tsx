import { ReactElement, useState } from "react";
import IconFont from "../../../utils/icon";
import HistoryTable from "./components/history";
import EntryTable from "./components/entry";
import HackathonTable from "./components/hackathon";
import BonusTable from "./components/bonus";
import RecordTable from "./components/record";

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

const HackathonAssetsCard = (props:{address:string,chain:string}): ReactElement => {
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
          {["Hackathon","Vote History", "Entry", "Bonuscenter","Invitation Record"].map(
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
            active === 0 && <HackathonTable {...props}/>  ||
            active === 1 && <HistoryTable {...props}/> ||
            active === 2 && <EntryTable {...props}/> ||
            active === 3 && <BonusTable {...props}/> ||
            active === 4 && <RecordTable {...props}/>
        }
      </div>
    </div>
  );
};

export default HackathonAssetsCard;
