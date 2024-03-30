import { ReactElement, ReactNode } from "react";
import { Table, TableProps } from 'antd';

interface Props {
    chain_id: string
}

interface DataType {
    key: string;
    token: {
        icon: string,
        symbol: string
    };
    address: string;
    balance: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        render: (_, _record, index) => (
            <p className="w-tr">{index + 1}</p>
        ),
        align:'match-parent'
    },
    {
        title: 'Token Logo',
        dataIndex: 'token',
        key: 'token',
        render:(_,record) => (
            <div className="token-msg">
                <img src={record.token.icon} alt="" />
                <p>{record.token.symbol}</p>
            </div>
        )
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render:(_,record) => (
            <p className="w-tr">{record.address}</p>
        )
    },
    {
        title: 'Token Balance',
        dataIndex: 'balance',
        key: 'balance',
        render:(_,record) => (
            <p className="w-tr">{record.balance}</p>
        )
    }
];

const data: DataType[] = [
    {
        key: '1',
        token: {
            icon: require('../../../assets/images/eth.logo.png'),
            symbol: 'ETH'
        },
        address: '0xbD19c55cEAED0bF7b71CC939316971E8C640730E',
        balance: '0.0025',
    },
    {
        key: '2',
        token: {
            icon: require('../../../assets/images/eth.logo.png'),
            symbol: 'ETH'
        },
        address: '0xbD19c55cEAED0bF7b71CC939316971E8C640730E',
        balance: '0.0025',
    },
    {
        key: '3',
        token: {
            icon: require('../../../assets/images/eth.logo.png'),
            symbol: 'ETH'
        },
        address: '0xbD19c55cEAED0bF7b71CC939316971E8C640730E',
        balance: '0.0025',
    },
];
export const TokensList = (props: Props): ReactElement<ReactNode> => {
    return (
        <div className="tokens-list">
            <Table columns={columns} dataSource={data} bordered={false} pagination={false} />;
        </div>
    )
};

export default TokensList;