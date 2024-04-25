import { ReactElement } from "react";
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { flag } from "../../../../../utils/source";

interface DataType {
  key: string;
  ins: string;
  event: string;
  price: {
    total: number | string,
    total_u:number
  }
  quan: number;
  total: {
    total_i: number | string,
    total_u: number
  };
  from: string;
  to: string;
  time:string
}
const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Inscrition',
    dataIndex: 'ins',
    key: 'ins',
    render: (text) => <p className="with-underline">{ text }</p>,
  },
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
    render: (text) => <p className={`event-t ${text === '1' ? 'sold-active' : ''}`}>{ text === '1' ? 'Sold' : 'Listed'}</p>
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width:150,
    render: (_) => <div className="price-box">
      <p className="bold-text t-l">{_.total}&nbsp;<span>sate/ordi</span></p>
      <p className="t-l">$&nbsp;{ _.total_u }</p>
    </div>
  },
  {
    title: 'Quantity',
    key: 'quan',
    dataIndex: 'quan',
    render: (text) => <p className="bold-text">{ text }</p>
  },
  {
    title: 'Total Value',
    dataIndex: 'total',
    key: 'total',
    width: 150,
    render: (_) => <div className="price-box">
      <p className="bold-text t-l">{_.total_i}&nbsp;<span>sats</span></p>
      <p className="t-l">$&nbsp;{ _.total_u }</p>
    </div>
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    render: (text) => <p className="bold-text">{ text }</p>
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    render: (text) => <p className="bold-text">{ text ? text : '-' }</p>
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    render: (text) => <p className="with-underline out-bold">{ text }</p>
  },
];

const data: DataType[] = [
  {
    key: '1',
    ins: '#67890099',
    event: '1',
    price: {
      total: '10,900',
      total_u:78.43
    },
    quan: 15,
    total: {
      total_i: '1,635,000',
      total_u:1176.47
    },
    from: 'bc2q9…gbhyu',
    to: 'bc2q9…gbhyu',
    time:'2024/4/8 20:34:19'
  },
  {
    key: '2',
    ins: '#67890099',
    event: '2',
    price: {
      total: '10,900',
      total_u:78.43
    },
    quan: 9.08,
    total: {
      total_i: '1,635,000',
      total_u:78.43
    },
    from: 'bc2q9…gbhyu',
    to: 'bc2q9…gbhyu',
    time:'2024/4/8 20:34:19'
  },
  {
    key: '3',
    ins: '#67890099',
    event: '1',
    price: {
      total: '10,900',
      total_u:78.43
    },
    quan: 2,
    total: {
      total_i: '1,635,000',
      total_u:78.43
    },
    from: 'bc2q9…gbhyu',
    to: '',
    time:'2024/4/8 20:34:19'
  },
];



const OrdersTab = (): ReactElement => {
  return (
    <div className="orders-tab">
      <Table columns={columns} dataSource={data} scroll={{ x: flag ? 1360 : 0 }} pagination={ false } />
    </div>
  )
};

export default OrdersTab;