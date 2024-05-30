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

const HackathonAssetsCard = (props:{address:string}): ReactElement => {
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
          {["Hackathon","Vote History", "Entry", "Bonuscenter"].map(
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
            active === 0 && <HackathonTable address={props.address}/>  ||
            active === 1 && <EntryTable address={props.address}/> ||
            active === 2 && <HistoryTable address={props.address}/> ||
            active === 3 && <BonusTable address={props.address}/> 
        }
      </div>
    </div>
  );
};

export default HackathonAssetsCard;
