import { DownOutlined } from "@ant-design/icons";
import { ReactElement, useState } from "react";
import ListedTab from "./components/listed";
import OrdersTab from "./components/orders";

const Brc20Land = (): ReactElement => {
  const [dataType, setDataType] = useState<string>('Listed');
  return (
    <div className="brc20-land">
      <div className="tabs-box">
        <ul>
          {
            ['Listed', 'Orders'].map((item: string, index: number) => {
              return (
                <li key={index} className={`${dataType === item ? 'active-data' : ''}`} onClick={() => {
                  setDataType(item);
                }}>
                  <p>{item}</p>
                  <p className="active-line"></p>
                </li>
              )
            })
          }
        </ul>
      </div>
      { dataType === 'Listed' && <div className="filter-box">
        <div className="filter-inner">
          <p>Votes hight to low</p>
          <DownOutlined />
        </div>
      </div>}
      <div className="inner-data">
        {
          dataType === 'Listed'
            ? <ListedTab />
            : <OrdersTab />
        }
      </div>
    </div>
  )
};

export default Brc20Land;