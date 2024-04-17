import { ReactElement, ReactNode } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";

import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  name: {
    icon: string,
    name: string
  };
  chians: string[];
  price: number | string;
  d1: number;
  d7: number,
  d30: number,
  cap: number | string,
  cap_r: number,
  supply: number | string,
  issue: number
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '#',
    key: 'index',
    render: (_text, _, index) => <p className="bold-text">{index + 1}</p>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_) => <div className="icon-box">
      <img src={_.icon} alt="" />
      <p className="bold-text">{_.name}</p>
    </div>
  },
  {
    title: 'Chains',
    dataIndex: 'chains',
    key: 'chains',
    render: (_text, _) => <div className="chains-list">
      {
        _.chians.map((item: string, index: number) => {
          return (
            <img src={item} alt="" key={index} />
          )
        })
      }
    </div>
  },
  {
    title: 'Price',
    key: 'price',
    dataIndex: 'price',
    render: (text) => <p>${text}</p>
  },
  {
    title: '1D %',
    key: 'd1',
    dataIndex: 'd1',
    render: (text) => <p className="up-c">
      <CaretUpOutlined />
      {text}%
    </p>
  },
  {
    title: '7D %',
    key: 'd7',
    dataIndex: 'd7',
    render: (text) => <p className="down-c">
      <CaretDownOutlined />
      {text}%
    </p>
  },
  {
    title: '30D %',
    key: 'd30',
    dataIndex: 'd30',
    render: (text) => <p className="up-c">
      <CaretUpOutlined />
      {text}%
    </p>
  },
  {
    title: 'Market Cap',
    key: 'cap',
    dataIndex: 'cap',
    render: (text) => <p>${text}</p>
  },
  {
    title: 'Market Cap Rank',
    key: 'cap_r',
    dataIndex: 'cap_r',
    align: 'center'
  },
  {
    title: 'Circulating Supply',
    key: 'supply',
    dataIndex: 'supply'
  },
  {
    title: 'Issue Year',
    key: 'issue',
    dataIndex: 'issue',
    align:'right'
  }
];

const data: DataType[] = [
  {
    key: '1',
    name: {
      icon: require('../../assets/images/test2.png'),
      name: 'Alex'
    },
    chians: [
      require('../../assets/images/eth.logo.png'),
      require('../../assets/new/plian_logo_black.png'),
    ],
    price: '0.000000593282024',
    d1: 1.13,
    d7: 4.45,
    d30: 2.12,
    cap: '139,248,437.2638',
    cap_r: 97,
    supply: '139,248,437.2638',
    issue: 2024
  },
  {
    key: '1',
    name: {
      icon: require('../../assets/images/test2.png'),
      name: 'Alex'
    },
    chians: [
      require('../../assets/images/eth.logo.png'),
      require('../../assets/new/plian_logo_black.png'),
    ],
    price: '0.000000593282024',
    d1: 1.13,
    d7: 4.45,
    d30: 2.12,
    cap: '139,248,437.2638',
    cap_r: 97,
    supply: '139,248,437.2638',
    issue: 2024
  },
  {
    key: '1',
    name: {
      icon: require('../../assets/images/test2.png'),
      name: 'Alex'
    },
    chians: [
      require('../../assets/images/eth.logo.png'),
      require('../../assets/new/plian_logo_black.png'),
    ],
    price: '0.000000593282024',
    d1: 1.13,
    d7: 4.45,
    d30: 2.12,
    cap: '139,248,437.2638',
    cap_r: 97,
    supply: '139,248,437.2638',
    issue: 2024
  },
  {
    key: '1',
    name: {
      icon: require('../../assets/images/test2.png'),
      name: 'Alex'
    },
    chians: [
      require('../../assets/images/eth.logo.png'),
      require('../../assets/new/plian_logo_black.png'),
    ],
    price: '0.000000593282024',
    d1: 1.13,
    d7: 4.45,
    d30: 2.12,
    cap: '139,248,437.2638',
    cap_r: 97,
    supply: '139,248,437.2638',
    issue: 2024
  },
  {
    key: '1',
    name: {
      icon: require('../../assets/images/test2.png'),
      name: 'Alex'
    },
    chians: [
      require('../../assets/images/eth.logo.png'),
      require('../../assets/new/plian_logo_black.png'),
    ],
    price: '0.000000593282024',
    d1: 1.13,
    d7: 4.45,
    d30: 2.12,
    cap: '139,248,437.2638',
    cap_r: 97,
    supply: '139,248,437.2638',
    issue: 2024
  },
  {
    key: '1',
    name: {
      icon: require('../../assets/images/test2.png'),
      name: 'Alex'
    },
    chians: [
      require('../../assets/images/eth.logo.png'),
      require('../../assets/new/plian_logo_black.png'),
    ],
    price: '0.000000593282024',
    d1: 1.13,
    d7: 4.45,
    d30: 2.12,
    cap: '139,248,437.2638',
    cap_r: 97,
    supply: '139,248,437.2638',
    issue: 2024
  },
  {
    key: '1',
    name: {
      icon: require('../../assets/images/test2.png'),
      name: 'Alex'
    },
    chians: [
      require('../../assets/images/eth.logo.png'),
      require('../../assets/new/plian_logo_black.png'),
    ],
    price: '0.000000593282024',
    d1: 1.13,
    d7: 4.45,
    d30: 2.12,
    cap: '139,248,437.2638',
    cap_r: 97,
    supply: '139,248,437.2638',
    issue: 2024
  },
];


const MemesView = (): ReactElement<ReactNode> => {
  return (
    <div className="memes-view">
      <div className="memes-inner">
        <p className="view-title">Memes</p>
        <div className="table-list">
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </div>
      <FooterNew />
    </div>
  )
};

export default MemesView;