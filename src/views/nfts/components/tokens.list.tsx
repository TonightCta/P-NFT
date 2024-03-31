import { ReactElement, ReactNode, useEffect, useState } from "react";
import { Table, TableProps } from 'antd';
import { useContract } from "../../../utils/contract";

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
        align: 'match-parent'
    },
    {
        title: 'Token Logo',
        dataIndex: 'token',
        key: 'token',
        render: (_, record) => (
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
        render: (_, record) => (
            <p className="w-tr">{record.address}</p>
        )
    },
    {
        title: 'Token Balance',
        dataIndex: 'balance',
        key: 'balance',
        render: (_, record) => (
            <p className="w-tr">{record.balance}</p>
        )
    }
];
interface Token {
    key: string,
    token: {
        icon: string,
        symbol: string,
    },
    address: string,
    balance: string
}
export const TokensList = (props: Props): ReactElement<ReactNode> => {
    const [data, setData] = useState<Token[]>(props.chain_id === '8007736' ? [
        {
            key: '1',
            token: {
                icon: require('../../../assets/images/pnft.png'),
                symbol: 'PNFT'
            },
            address: '0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08',
            balance: '0.0000',
        },
    ] : []);
    const { balanceErc20 } = useContract();
    const queryBalance = async () => {
        const balance = await balanceErc20('0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08');
        setData([
            {
                key: '1',
                token: {
                    icon: require('../../../assets/images/pnft.png'),
                    symbol: 'PNFT'
                },
                address: '0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08',
                balance: String((+balance / 1e18).toFixed(4)),
            },
        ])
    }
    useEffect(() => {
        props.chain_id === '8007736' ? setTimeout(() => { queryBalance() }, 1000) : setData([]);
    }, [props.chain_id])
    return (
        <div className="tokens-list">
            <Table columns={columns} dataSource={data} bordered={false} pagination={false} />;
        </div>
    )
};

export default TokensList;