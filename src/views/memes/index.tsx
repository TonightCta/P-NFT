import { ReactElement, ReactNode, useEffect, useState } from "react";
import FooterNew from "../screen.new/components/footer.new";
import { CurrencyList } from '../../request/api'
import { Popover, Spin, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, MoreOutlined } from "@ant-design/icons";
import './index.scss'
import { addCommasToNumber } from "../../utils";
import { flag } from "../../utils/source";

interface DataType {
  key: string;
  description: string;
  logo_minio_url: string,
  currency_name: string,
  chain_info: {
    chain_id: string,
    logo_url: string
  }[];
  price_usdt: number;
  percent_change_1d: number;
  percent_change_7d: number,
  percent_change_30d: number,
  cap: number | string,
  market_cap_rank: number,
  total_supply: number | string,
  issue_year: number
}
interface Chain {
  chain_id: string,
  logo_url: string
}
const toNormalNumber = (number: number): string => {
  {
    const e = String(number)
    let rex = /^([0-9])\.?([0-9]*)e-([0-9])/
    if (!rex.test(e)) return String(number)
    const numArr = e.match(rex)
    const n = Number('' + numArr![1] + (numArr![2] || ''))
    const num = '0.' + String(Math.pow(10, Number(numArr![3]) - 1)).substr(1) + n
    return num.replace(/0*$/, '')
  }
}
const countTrailingZeros = (numberString: string) => {
  const decimalIndex = numberString.indexOf('.');
  const decimalPart = numberString.substring(decimalIndex + 1);
  const match = decimalPart.match(/^(0*)[1-9]/);
  if (match) {
    const last = decimalPart.substring(match[1].length, match[1].length + 2);
    // console.log(decimalPart.substring(match[1].length, match[1].length + 2));
    return `$0.0{${match[1].length}}${last}`
  }
}
const MoreChainPop = (props: {
  chains: Chain[]
}) => {
  return (
    <ul className="pop-chain-list">
      {
        props.chains.map((item: Chain, index: number) => {
          return (
            <li key={index}>
              {index !== 0 && <img src={require(`../../assets/logo/${item.chain_id}.png`)} alt="" />}
            </li>
          )
        })
      }
    </ul>
  )
}
const columns: TableProps<DataType>['columns'] = [
  {
    title: '#',
    key: 'rank',
    dataIndex: 'rank',
    render: (text) => <p className="bold-text">{text}</p>,
    width: flag ? 60 : 'auto'
  },
  {
    title: 'Name',
    key: 'description',
    render: (_) => <div className="icon-box">
      <img src={_.logo_minio_url} alt="" />
      <p className="bold-text flex-c">{_.description}<span>{_.currency_name}</span></p>
    </div>
  },
  {
    title: 'Chains',
    key: 'chain_info',
    render: (_text, _) => <div className="chains-list">
      {
        _.chain_info.length <= 2
          ? _.chain_info.map((item: Chain, index: number) => {
            return (
              <img src={require(`../../assets/logo/${item.chain_id}.png`)} alt="" key={index} />
            )
          })
          : <div className="more-logo">
            <img src={require(`../../assets/logo/${_.chain_info[0].chain_id}.png`)} alt="" />
            <Popover placement="right" title={null} content={<MoreChainPop chains={_.chain_info} />}>
              <div className="more-btn">
                <MoreOutlined />
              </div>
            </Popover>
          </div>
      }
    </div>
  },
  {
    title: 'Price',
    key: 'price_usdt',
    dataIndex: 'price_usdt',
    render: (text) => <>
      {
        text > 0.01
          ? <p>${text.toFixed(4)}</p>
          : <p>{countTrailingZeros(toNormalNumber(text))}</p>
      }

    </>
  },
  {
    title: '1D %',
    key: 'percent_change_1d',
    dataIndex: 'percent_change_1d',
    render: (text) => <p className={`${text > 0 ? 'up-c' : 'down-c'}`}>
      {text > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
      {text.toFixed(2)}%
    </p>
  },
  {
    title: '7D %',
    key: 'percent_change_7d',
    dataIndex: 'percent_change_7d',
    render: (text) => <p className={`${text > 0 ? 'up-c' : 'down-c'}`}>
      {text > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
      {text.toFixed(2)}%
    </p>
  },
  {
    title: '30D %',
    key: 'percent_change_30d',
    dataIndex: 'percent_change_30d',
    render: (text) => <p className={`${text > 0 ? 'up-c' : 'down-c'}`}>
      {text > 0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
      {text.toFixed(2)}%
    </p>
  },
  {
    title: 'Market Cap',
    key: 'market_cap_usdt',
    dataIndex: 'market_cap_usdt',
    render: (text) => <p>${addCommasToNumber(text.toFixed(0))}</p>
  },
  {
    title: 'Market Cap Rank',
    key: 'market_cap_rank',
    dataIndex: 'market_cap_rank',
    align: 'center'
  },
  {
    title: 'Circulating Supply',
    key: 'total_supply',
    dataIndex: 'total_supply',
    render: (text) => <p>{addCommasToNumber(text.toFixed(0))}</p>
  },
  {
    title: 'Issue Year',
    key: 'issue_year',
    dataIndex: 'issue_year',
    align: 'right'
  }
];


const MemesView = (): ReactElement<ReactNode> => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getMemesList = async () => {
    setLoading(true)
    const result = await CurrencyList({
      category: 'meme',
      page_size: 30,
      page_num: 1
    });
    const { data } = result;
    setLoading(false);
    data.data.item = data.data.item.map((item: DataType, index: number) => {
      return {
        ...item,
        key: index + 1
      }
    })
    setData(data.data.item);
  };
  useEffect(() => {
    getMemesList();
  }, [])
  return (
    <div className="memes-view">
      <div className="memes-inner">
        <div className="mask-box">
          <img src={require('../../assets/images/memes_mask.png')} className="left-mask" alt="" />
        </div>
        <p className="view-title">Memes</p>
        <div className="table-list">
          {/* {loading
            ? <Spin size="large" />
            : <Table columns={columns} dataSource={data} pagination={false} />} */}
          <Table columns={columns} scroll={{ x: flag ? 1660 : 0 }} loading={loading} dataSource={data} pagination={false} locale={{
            emptyText: loading ? <p></p> : <p>No Data</p>
          }} />
        </div>
      </div>
      <FooterNew />
    </div>
  )
};

export default MemesView;