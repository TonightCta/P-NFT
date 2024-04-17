import { ReactElement, useState } from "react";

import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  collection: {
    poster: string,
    name: string
  };
  volume: {
    total: number,
    persent: number
  };
  floor: {
    total: number,
    total_u: number
  };
  listed: number;
  item: number
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '#',
    key: 'index',
    render: (_text, _, index) => <p>{index + 1}</p>,
  },
  {
    title: 'Collection',
    dataIndex: 'collection',
    key: 'collection',
    render: (_) => <div className="poster-box">
      <img src={_.poster} alt="" />
      <p className="bold-text">{ _.name }</p>
    </div>
  },
  {
    title: 'Volume(24h)',
    dataIndex: 'volume',
    key: 'volume',
    align: 'right',
    render: (_) => <div className="wrap-text">
      <p className="bold-text">{_.total}&nbsp;BTC</p>
      <p className="g-c">{ _.persent }%</p>
    </div>
  },
  {
    title: 'Floor price',
    key: 'floor',
    dataIndex: 'floor',
    align:'right',
    render: (_) => <div className="wrap-text">
      <p className="bold-text">{_.total}</p>
      <p className="g-c gr-c">$&nbsp;{ _.total_u }</p>
    </div>
  },
  {
    title: 'Listed',
    key: 'listed',
    dataIndex: 'listed',
    align: 'center',
    render: (text) => <p className="bold-text">{ text }</p> 
  },
  {
    title: 'Item',
    key: 'item',
    dataIndex: 'item',
    align: 'right',
    render: (text) => <p className="bold-text">{ text }</p> 
  },

];

const data: DataType[] = [
  {
    key: '1',
    collection: {
      poster: require('../../../../assets/images/test2.png'),
      name: 'Alex',
    },
    volume: {
      total: 0.0453,
      persent: 100
    },
    floor: {
      total: 0.053,
      total_u: 3951.99
    },
    listed: 2,
    item: 765,
  },
  {
    key: '2',
    collection: {
      poster: require('../../../../assets/images/test2.png'),
      name: 'Brian',
    },
    volume: {
      total: 0.0453,
      persent: 100
    },
    floor: {
      total: 0.053,
      total_u: 3951.99
    },
    listed: 2,
    item: 765,
  },
  {
    key: '3',
    collection: {
      poster: require('../../../../assets/images/test2.png'),
      name: 'Brian',
    },
    volume: {
      total: 0.0453,
      persent: 100
    },
    floor: {
      total: 0.053,
      total_u: 3951.99
    },
    listed: 2,
    item: 765,
  },
];


const CollectionLand = (): ReactElement => {
  const [dataType, setDataType] = useState<string>('Trending')
  return (
    <div className="collection-land">
      <div className="tabs-box">
        <ul>
          {
            ['Trending'].map((item: string, index: number) => {
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
      <div className="table-list">
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  )
};

export default CollectionLand;