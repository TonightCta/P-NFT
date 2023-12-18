import { ReactElement, useContext, useEffect, useState } from "react";
import IconFont from '../../../utils/icon';
import { Checkbox, Pagination, Popover, Radio, Select, Space, Spin } from "antd";
import InnerCard from "./inner.card";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { RadioChangeEvent } from 'antd';
import { CategoryList, LabelList, CollectionInfoNFT, CurrencyList } from '../../../request/api';
import { PNft } from "../../../App";
import MobileFilter from "./mobile.filter";
import { flag } from "../../../utils/source";
import { CloseOutlined } from "@ant-design/icons";

interface Show {
    status: boolean,
    labels: boolean,
    category: boolean,
    currency: boolean,
    filter: boolean
}

export interface Currency {
    label: string,
    value: number,
    address: string
}

const ListCard = (props: { chainID: string }): ReactElement => {
    const { state } = useContext(PNft);
    const [mobileDrawer, setMobileDrawer] = useState<boolean>(false);
    const [labelsList, setLabelsList] = useState<{ label_id: number, label_name: string }[]>([]);
    const [labelsID, setLabelsID] = useState<number[]>([]);
    const [plainOptions, setPlainOptions] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<{ category_id: number, category_name: string }[]>([]);
    const [categoryID, setCategoryID] = useState<number>(0);
    const [status, setStatus] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(10);
    const [data, setData] = useState<any[]>([]);
    const [listWait, setListWait] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [labelsText, setLabelsText] = useState<string[]>([]);
    const [currencyList, setCurrencyList] = useState<Currency[]>([]);
    const [token, setToken] = useState<string>('999');
    const [selectCurrency, setSelectCurrency] = useState<Currency>({
        label: '',
        value: 999,
        address: ''
    });
    const [num, setNum] = useState<{ min: string | number, max: string | number }>({
        min: '',
        max: ''
    })
    const [size, setSize] = useState<number>(10)
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
    };
    const getCurrencyList = async () => {
        const result = await CurrencyList({
            chain_id: props.chainID,
            page_size: 200
        });
        const { data } = result;
        if(!data.data.item){
            return
        }
        data.data.item = data.data.item.map((item: { currency_name: string, contract_address: string, currency_id: number }) => {
            return {
                label: item.currency_name,
                value: item.currency_id,
                address: item.contract_address
            }
        });
        data.data.item.unshift({
            label: 'All',
            value: '999',
            address: ''
        })
        setCurrencyList(data.data.item);
    }
    useEffect(() => {
        getLabelList();
        getCategoryList();
        getCurrencyList();
    }, [])
    const [sort, setSort] = useState<boolean>(false);
    const [sortID, setSortID] = useState<{ sort: number, sory_by: number, text: string }>({
        sort: 0,
        sory_by: 1,
        text: 'Recently Minted'
    });
    const [show, setShow] = useState<Show>({
        status: false,
        labels: false,
        currency: false,
        category: false,
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
        setLabelsText(checkedValues as string[]);
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
            sort: sortID.sort,
            page_size: size,
            page_num: page,
            sort_by: sortID.sory_by,
            is_listed: status === 0 ? false : true,
            key_word: search,
            pay_currency_contract: selectCurrency.address,
            price_min: Number((+num.min).toFixed(2)),
            price_max: Number(+(+num.max).toFixed(2))
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
    useEffect(() => {
        setSize(show.filter ? 10 : 12);
    }, [show.filter])
    useEffect(() => {
        setSearch('');
        getCollectionNFTs();
    }, [labelsID, categoryID, sortID, page, status, show.filter, size, search, selectCurrency.address, num.min, num.max]);
    const handleChange = (value: string) => {
        setToken(value);
        if (value === '999') {
            setSelectCurrency({
                label: '',
                value: 999,
                address: ''
            });
            return
        }
        const as = currencyList.filter((item: Currency) => { return +value === item.value });
        setSelectCurrency(as[0]);
    };
    // useEffect(() => {
    //     if (!search) {
    //         getCollectionNFTs();
    //         return
    //     }
    //     searchNFTs();
    // }, [search])
    const content = (
        <div className="sort-popover-box">
            <ul onClick={() => {
                setSort(false)
            }}>
                <li onClick={() => {
                    setSortID({
                        sort: 1,
                        sory_by: 0,
                        text: 'Price Low to High'
                    })
                }}>Price Low to High</li>
                <li onClick={() => {
                    setSortID({
                        sort: 1,
                        sory_by: 1,
                        text: 'Price High to Low'
                    })
                }}>Price High to Low</li>
                <li onClick={() => {
                    setSortID({
                        sort: 2,
                        sory_by: 1,
                        text: 'Recently Listed'
                    })
                }}>
                    Recently Listed
                </li>
                <li onClick={() => {
                    setSortID({
                        sort: 0,
                        sory_by: 1,
                        text: 'Recently Minted'
                    })
                }}>
                    Recently Minted
                </li>
                <li onClick={() => {
                    setSortID({
                        sort: 0,
                        sory_by: 0,
                        text: 'Oldest'
                    })
                }}>
                    Oldest Minted
                </li>
                <li onClick={() => {
                    setSortID({
                        sort: 2,
                        sory_by: 0,
                        text: 'Oldest Listed'
                    })
                }}>
                    Oldest Listed
                </li>
            </ul>
        </div>
    );
    useEffect(() => {
        const clear = () => {
            setSelectCurrency({
                label: 'All',
                value: 999,
                address: ''
            });
            setToken('999');
            setNum({
                min: '',
                max: ''
            });
        };
        status === 0 && clear();
    }, [status])
    return (
        <div className="list-card">
            <div className="filter-box">
                <div className="left-menu" onClick={flag ? () => {
                    setMobileDrawer(true)
                } : () => {
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
                            <p>{sortID.text}</p>
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
                            currency: !show.currency
                        })
                    }}>
                        <p>Currency</p>
                        <IconFont type="icon-xiangxia" className={`${!show.currency ? 'hide-arrow' : ''}`} />
                    </div>
                    <div className={`filter-currency filter-open-box ${!show.currency ? 'hide-box' : ''}`}>
                        <Select
                            onChange={handleChange}
                            placeholder="Select Token"
                            options={currencyList}
                            value={token}
                        />
                        <div className="num-filter">
                            <input type="number" placeholder="Min" value={num.min} onChange={(e) => {
                                setNum({
                                    ...num,
                                    min: e.target.value
                                })
                            }} />
                            <p>-</p>
                            <input type="number" placeholder="Max" value={num.max} onChange={(e) => {
                                setNum({
                                    ...num,
                                    max: e.target.value
                                })
                            }} />
                        </div>
                        {/* <p className={`apply-btn ${(status === 0 || !num.min || !num.max) && 'dis-btn'}`}>
                            <Button type="primary" disabled={status === 0 || !num.min || !num.max} onClick={getCollectionNFTs}>Apply</Button>
                        </p> */}
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
                        <Checkbox.Group options={plainOptions} defaultValue={['Apple']} value={labelsText} onChange={onChange} />
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
                <div className="right-data">
                    <div className="filter-text">
                        {status === 1 && <div className="status-text public-text">
                            <p>Listed</p>
                            <CloseOutlined onClick={() => {
                                setStatus(0)
                            }} />
                        </div>}
                        {(selectCurrency.address || num.max || num.min) && <div className="currency-text public-text">
                            {(num.min || num.max) && <p className="small-text">&nbsp;{num.min ? num.min : 0}&nbsp;~&nbsp;{num.max ? num.max : 'Unlimited'}</p>}
                            <p>{selectCurrency.label}</p>
                            <CloseOutlined onClick={() => {
                                setSelectCurrency({
                                    label: 'All',
                                    value: 999,
                                    address: ''
                                });
                                setToken('999');
                                setNum({
                                    min: '',
                                    max: ''
                                });
                                getCollectionNFTs();
                            }} />
                        </div>}
                        {
                            categoryID !== 0 && <div className="category-text public-text">
                                <p>{categoryList.filter((item) => { return categoryID === item.category_id })[0].category_name}</p>
                                <CloseOutlined onClick={() => {
                                    setCategoryID(0)
                                }} />
                            </div>
                        }
                        {
                            labelsText.length > 0 && <div className="labels-text public-text">
                                <p>{labelsText.join(',')}</p>
                                <CloseOutlined onClick={() => {
                                    setLabelsID([]);
                                    setLabelsText([]);
                                    onChange([]);
                                }} />
                            </div>
                        }
                    </div>
                    {
                        listWait
                            ? <div className="loading-box">
                                <Spin size="large" />
                            </div>
                            : <div className="m-w">
                                {data.length > 0 && <div className={`list-box ${!show.filter ? 'more-items' : ''}`}>
                                    {
                                        data.map((item: any, index: number) => {
                                            return (
                                                <InnerCard key={index} item={item} />
                                            )
                                        })
                                    }
                                </div>}
                                {
                                    !listWait && data.length < 1 && <p className="no-data">No data</p>
                                }
                            </div>
                    }
                </div>
            </div>
            {<div className={`page-box ${!show.filter ? 'normal-center' : ''}`}>
                <Pagination defaultCurrent={1} onShowSizeChange={(e, size) => {
                    setSize(size);
                }} total={total} onChange={(e) => {
                    setPage(e)
                }} />
            </div>}
            <MobileFilter chainID={props.chainID} visible={mobileDrawer} closeDrawer={(val: boolean) => {
                setMobileDrawer(val)
            }} setStatus={(val: number) => {
                setStatus(val)
            }} setCategoryID={(val: number) => {
                setCategoryID(val);
            }} setLabelsID={(val: number[]) => {
                setLabelsID(val);
            }} setCurrency={(val: Currency) => {
                setSelectCurrency(val);
            }} setNum={(val: { min: string | number, max: number | string }) => {
                setNum(val);
            }} />
        </div>
    )
};

export default ListCard;