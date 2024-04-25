import { Button, Flex } from "antd";
import { ReactElement } from "react";
import { flag } from "../../../../../utils/source";

const ListedTab = (): ReactElement => {
  const ListCard = () => {
    return (
      <div className="list-card">
        <div className="to-msg">
          <div className="card-oper">
            <p>BRC20</p>
            <p>Transfer</p>
          </div>
          <p className="list-a">300</p>
          <p className="list-total"><span>102,288</span>&nbsp;sats/ordi</p>
          <p className="list-amount">$&nbsp;76.86</p>
        </div>
        <div className="b-box">
          <p className="list-id">#23456998</p>
          <div className="list-b-p">
            <p>
              <img src={require('../../../../../assets/images/bitcoin.logo.png')} alt="" />
              0.3245609
            </p>
            <p className="list-p-u">$&nbsp;23858.91</p>
          </div>
          <Button type="primary">Buy</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="listed-tab">
      <Flex wrap="wrap" gap={flag ? 20 : 40}>
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item: number, index: number) => {
            return (
              <li key={index}>
                <ListCard />
              </li>
            )
          })
        }
      </Flex>
    </div>
  )
};

export default ListedTab;