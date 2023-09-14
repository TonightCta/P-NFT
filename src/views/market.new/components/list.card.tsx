import { ReactElement, useContext, useEffect, useState } from "react";
import IconFont from '../../../utils/icon';
import { Checkbox, Pagination, Popover, Radio, Space, Spin } from "antd";
import InnerCard from "./inner.card";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { RadioChangeEvent } from 'antd';
import { CategoryList, LabelList, CollectionInfoNFT, CollectionSearch } from '../../../request/api';
import { PNft } from "../../../App";

interface Show {
    status: boolean,
    labels: boolean,
    category: boolean,
    filter: boolean
}

const ListCard = (): ReactElement => {
    const { state } = useContext(PNft);
    const [labelsList, setLabelsList] = useState<{ label_id: number, label_name: string }[]>([]);
    const [labelsID, setLabelsID] = useState<number[]>([]);
    const [plainOptions, setPlainOptions] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<{ category_id: number, category_name: string }[]>([]);
    const [categoryID, setCategoryID] = useState<number>(0);
    const [status, setStatus] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(10);
    const [data, setData] = useState<any[]>([]);
    const [listWait, setListWait] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const getLabelList = async () => {
        const result = await LabelList({ page_size: 500 });
        const { data } = result;
        const arr: string[] = data.data.item.map((item: { label_id: number, label_name: string }) => {
            return item.label_name
        });
        setPlainOptions(arr);
        setLabelsList(data.data.item)
    };
    const getCategoryList = async () => {
        const result = await CategoryList({ page_size: 500 });
        const { data } = result;
        data.data.item.unshift({
            category_id: 0,
            category_name: 'All'
        })
        setCategoryList(data.data.item);
    }
    useEffect(() => {
        getLabelList();
        getCategoryList();
    }, [])
    const [sort, setSort] = useState<boolean>(false);
    const [sortID, setSortID] = useState<number>(0);
    const [show, setShow] = useState<Show>({
        status: true,
        labels: true,
        category: true,
        filter: true
    })
    const onChangeRadio = (e: RadioChangeEvent) => {
        setCategoryID(e.target.value);
    };
    const onChange = (checkedValues: CheckboxValueType[]) => {
        const selectIDs: number[] = [];
        labelsList.forEach((item: { label_id: number, label_name: string }) => {
            checkedValues.forEach((e: CheckboxValueType) => {
                if (e === item.label_name) {
                    selectIDs.push(item.label_id)
                }
            })
        });
        setLabelsID(selectIDs);
    };
    const handleOpenChange = (newOpen: boolean) => {
        setSort(newOpen);
    };
    const getCollectionNFTs = async () => {
        setListWait(true);
        const result = await CollectionInfoNFT({
            collection_id: +(state.collection_id as string),
            category_id: categoryID,
            label_ids: labelsID,
            sort: sortID,
            page_size: show.filter ? 10 : 12,
            page_num: page,
            sort_by: 1,
            is_listed: status === 0 ? false : true
        });
        setListWait(false);
        const { data } = result;
        if (!data.data.item) {
            setTotal(10)
            setData([]);
            return
        }
        setTotal(data.data.total)
        setData(data.data.item);
    };
    const searchNFTs = async () => {
        setListWait(true);
        const result = await CollectionSearch({
            collection_id: +(state.collection_id as string),
            key_word: search,
            page_size: 10,
            page: page
        });
        setListWait(false);
        const { data } = result;
        if (!data.data.item) {
            setTotal(10)
            setData([]);
            return
        }
        setTotal(data.data.total)
        setData(data.data.item);
    }
    useEffect(() => {
        setSearch('');
        getCollectionNFTs();
    }, [labelsID, categoryID, sortID, page, status, show.filter]);
    useEffect(() => {
        if (!search) {
            getCollectionNFTs();
            return
        }
        searchNFTs();
    }, [search])
    const content = (
        <div className="sort-popover-box">
            <ul onClick={() => {
                setSort(false)
            }}>
                <li onClick={() => {
                    setSortID(0)
                }}>Time</li>
                <li onClick={() => {
                    setSortID(1)
                }}>Price</li>
            </ul>
        </div>
    )
    return (
        <div className="list-card">
            <div className="filter-box">
                <div className="left-menu" onClick={() => {
                    setShow({
                        ...show,
                        filter: !show.filter
                    })
                }}>
                    <IconFont type="icon-a-lujing219" className={`${!show.filter ? 'close-filter' : ''}`} />
                </div>
                <div className="search-box">
                    <IconFont type="icon-sousuo_search" />
                    <input type="text" value={search} onChange={(e) => {
                        setSearch(e.target.value)
                    }} placeholder="Search by name or description" />
                </div>
                <div className="sort-box">
                    <Popover open={sort} onOpenChange={handleOpenChange} content={content} placement="bottom" trigger={['click']}>
                        <div className="sort-inner">
                            <p>{sortID === 0 ? 'Time' : 'Price'}</p>
                            <IconFont type="icon-xiangxia" />
                        </div>
                    </Popover>
                </div>
            </div>
            <div className="data-box">
                <div className={`filter-box-data ${!show.filter ? 'hide-filter-box' : ''}`}>
                    <div className="filter-title" onClick={() => {
                        setShow({
                            ...show,
                            status: !show.status
                        })
                    }}>
                        <p>Status</p>
                        <IconFont type="icon-xiangxia" className={`${!show.status ? 'hide-arrow' : ''}`} />
                    </div>
                    <div className={`filter-status filter-open-box ${!show.status ? 'hide-box' : ''}`}>
                        <ul>
                            <li className={`${status === 0 ? 'active-status' : ''}`} onClick={() => {
                                setStatus(0);
                            }}>All</li>
                            <li className={`${status === 1 ? 'active-status' : ''}`} onClick={() => {
                                setStatus(1);
                            }}><p className="point"></p>Listed</li>
                        </ul>
                    </div>
                    <div className="filter-title" onClick={() => {
                        setShow({
                            ...show,
                            labels: !show.labels
                        })
                    }}>
                        <p>Labels</p>
                        <IconFont type="icon-xiangxia" className={`${!show.labels ? 'hide-arrow' : ''}`} />
                    </div>
                    <div className={`filter-labels filter-open-box ${!show.labels ? 'hide-box' : ''}`}>
                        <Checkbox.Group options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
                    </div>
                    <div className="filter-title" onClick={() => {
                        setShow({
                            ...show,
                            category: !show.category
                        })
                    }}>
                        <p>Category</p>
                        <IconFont type="icon-xiangxia" className={`${!show.category ? 'hide-arrow' : ''}`} />
                    </div>
                    <div className={`filter-category filter-open-box ${!show.category ? 'hide-box' : ''}`}>
                        <Radio.Group onChange={onChangeRadio} value={categoryID}>
                            <Space direction="vertical">
                                {
                                    categoryList.map((item: { category_id: number, category_name: string }, index: number) => {
                                        return (
                                            <Radio key={index} value={item.category_id}>{item.category_name}</Radio>
                                        )
                                    })
                                }
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
                {
                    listWait
                        ? <div className="loading-box">
                            <Spin size="large" />
                        </div>
                        : <div>
                            {data.length > 0 && <div className={`list-box ${!show.filter ? 'more-items' : ''}`}>
                                {
                                    data.map((item: any, index: number) => {
                                        return (
                                            <InnerCard key={index} item={item} />
                                        )
                                    })
                                }
                            </div>}
                        </div>
                }
                {
                    !listWait && data.length < 1 && <p className="no-data">No data</p>
                }
            </div>
            {!listWait && data.length > 0 && <div className={`page-box ${!show.filter ? 'normal-center' : ''}`}>
                <Pagination defaultCurrent={1} total={total} onChange={(e) => {
                    setPage(e)
                }} />
            </div>}
        </div>
    )
};

export default ListCard;