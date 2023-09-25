import { ReactElement, ReactNode, useEffect, useState } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";
import { Popover, Tooltip, Table, Image } from "antd";
import IconFont from "../../utils/icon";
import { CategoryList, CollectionList } from '../../request/api'
import type { ColumnsType } from 'antd/es/table';
import { flag } from "../../utils/source";

interface Category {
    category_name: string,
    category_id: number
}

interface DataType {
    key: string;
    logo_minio_url: string;
    collection_name: string;
    floor_price: number,
    listed_amount: number;
    pay_token_name: string;
    total_supply: number;
    owners_amount: number;
}

const columns: ColumnsType<DataType> = [
    {
        title: '#',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Collection',
        dataIndex: 'name',
        key: 'name',
        render: (_, { logo_minio_url, collection_name }) => (
            <div className="img-box">
                <Image
                    width={flag ? 42 : 72}
                    src={logo_minio_url}
                />
                <p>{collection_name}</p>
            </div>
        )
    },
    {
        title: 'Sales',
        dataIndex: 'listed_amount',
        key: 'listed_amount'
    },
    {
        title: 'Floor Price',
        dataIndex: 'floor_price',
        key: 'floor_price',
        align: 'center',
        render: (_, { floor_price, pay_token_name }) => <p>
            {floor_price}&nbsp;{pay_token_name}
        </p>
    },
    {
        title: 'Total Items',
        dataIndex: 'total_supply',
        key: 'total_supply',
    },
    {
        title: 'Owners',
        dataIndex: 'owners_amount',
        key: 'owners_amount',
    },
    {
        title: '% Unique owners',
        dataIndex: 'owners_amount',
        align:'right',
        key: 'owners_amount',
        render: (_, { owners_amount, total_supply }) => <div className="flex-d">
            <p>{(owners_amount / total_supply).toFixed(2)}%</p>
            <p>{owners_amount}&nbsp;owners</p>
        </div>
    },
];
const columnsMobile: ColumnsType<DataType> = [
    {
        title: '#',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Collection',
        dataIndex: 'name',
        key: 'name',
        render: (_, { logo_minio_url, collection_name }) => (
            <div className="img-box">
                <Image
                    width={flag ? 42 : 72}
                    src={logo_minio_url}
                />
                <p>{collection_name}</p>
            </div>
        )
    },
    {
        title: '% Unique owners',
        dataIndex: 'owners_amount',
        align:'right',
        key: 'owners_amount',
        render: (_, { owners_amount, total_supply }) => <div className="flex-d">
            <p>{(owners_amount / total_supply).toFixed(2)}%</p>
            <p>{owners_amount}&nbsp;owners</p>
        </div>
    },
];


const MarketViewAll = (): ReactElement<ReactNode> => {
    const [openCate, setOpenCate] = useState(false);
    const [openSort, setOpenSort] = useState(false);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const [selectCate, setSelectCate] = useState<Category>({
        category_name: 'All categories',
        category_id: 0
    })
    const getCategoryList = async () => {
        setWait(true)
        const result = await CategoryList({ page_size: 100 });
        const { data } = result;
        data.data.item.unshift({
            category_name: 'All categories',
            category_id: 0
        })
        setWait(false)
        setCategoryList(data.data.item);
    };
    useEffect(() => {
        getCategoryList();
        getDataList();
    }, [])
    const hideCate = () => {
        setOpenCate(false);
    };
    const hideSort = () => {
        setOpenSort(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpenCate(newOpen);
    };
    const handleOpenChangeSort = (newOpen: boolean) => {
        setOpenSort(newOpen)
    };
    const [data, setData] = useState<DataType[]>([]);
    const getDataList = async () => {
        const result = await CollectionList({
            page_size: 100
        });
        const { data } = result;
        data.data.item = data.data.item.map((item: DataType, index: number) => {
            return {
                ...item,
                key: String(index + 1)
            }
        });
        setData(data.data.item)
    };
    const contentCategory = (
        <div className="filter-popover">
            <ul onClick={hideCate}>
                {
                    categoryList.map((item: Category, index: number) => {
                        return (
                            <li key={index} className={`${item.category_id === selectCate.category_id ? 'active-filter' : ''}`} onClick={() => {
                                setSelectCate(item)
                            }}>{item.category_name}</li>
                        )
                    })
                }
            </ul>
        </div>
    );
    const contentSort = (
        <div className="filter-popover">
            <ul onClick={hideSort}>
                <li>123</li>
                <li>123</li>
                <li>123</li>
            </ul>
        </div>
    );
    return (
        <div className="market-view-all">
            <p className="all-title">Collection stats</p>
            <div className="all-filter-box">
                <div className="left-filter">
                    <Popover
                        content={contentCategory}
                        placement="bottom"
                        title={null}
                        trigger="click"
                        open={openCate}
                        onOpenChange={handleOpenChange}
                    >
                        <div className="select-box">
                            <p>{selectCate.category_name}</p>
                            <IconFont type="icon-xiangxia" />
                        </div>
                    </Popover>
                    <div className="select-chain">
                        <ul>
                            <li>All chains</li>
                            <li>
                                <Tooltip title="Ethereum">
                                    <img src={require('../../assets/new/eth_logo.png')} alt="" />
                                </Tooltip>
                            </li>
                            <li>
                                <Tooltip title="Plian">
                                    <img src={require('../../assets/new/plian_logo_black.png')} alt="" />
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                </div>
                {false && <div className="right-filter">
                    <Popover
                        placement="bottom"
                        content={contentSort}
                        title={null}
                        trigger="click"
                        open={openSort}
                        onOpenChange={handleOpenChangeSort}
                    >
                        <div className="select-box">
                            <p>Price low to high</p>
                            <IconFont type="icon-xiangxia" />
                        </div>
                    </Popover>
                </div>}
            </div>
            <div className="data-box">
                <Table loading={wait} columns={flag ? columnsMobile : columns} dataSource={data} />
            </div>
            <FooterNew />
        </div>
    )
};


export default MarketViewAll;