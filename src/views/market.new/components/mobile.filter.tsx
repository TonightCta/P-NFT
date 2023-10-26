import { Checkbox, Drawer, Radio, Select, Space } from "antd";
import { ReactElement, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { CategoryList, CurrencyList, LabelList } from "../../../request/api";
import type { RadioChangeEvent } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Currency } from "./list.card";

interface Props {
    visible: boolean,
    chainID:string,
    closeDrawer: (val: boolean) => void,
    setStatus: (val: number) => void,
    setCategoryID: (val: number) => void,
    setLabelsID: (val: number[]) => void,
    setCurrency:(val:Currency) => void,
    setNum:(val:{min:string | number,max:string | number}) => void
}

interface Show {
    status: boolean,
    labels: boolean,
    category: boolean,
    currency: boolean,
}

const MobileFilter = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [labelsList, setLabelsList] = useState<{ label_id: number, label_name: string }[]>([]);
    const [status, setStatus] = useState<number>(1);
    const [plainOptions, setPlainOptions] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<{ category_id: number, category_name: string }[]>([]);
    const onClose = () => {
        setVisible(false);
        props.closeDrawer(false);
    };
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
    const [show, setShow] = useState<Show>({
        status: true,
        labels: true,
        category: true,
        currency: true
    });
    const getCurrencyList = async () => {
        const result = await CurrencyList({
            chain_id: props.chainID,
            page_size: 200
        });
        const { data } = result;
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
    const onChangeRadio = (e: RadioChangeEvent) => {
        props.setCategoryID(e.target.value);
        onClose();
    };
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
        props.setCurrency(as[0])
        onClose();
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
        props.setLabelsID(selectIDs);
        onClose();
    };
    useEffect(() => {
        setVisible(props.visible);
        const get = () => {
            getLabelList();
            getCategoryList();
            getCurrencyList();
        }
        props.visible && get();
    }, [props.visible])
    return (
        <Drawer title="Filter" placement="left" onClose={onClose} open={visible}>
            <div className={`filter-box-data`}>
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
                            props.setStatus(0)
                            setStatus(0);
                            onClose();
                        }}>All</li>
                        <li className={`${status === 1 ? 'active-status' : ''}`} onClick={() => {
                            props.setStatus(1)
                            setStatus(1);
                            onClose();
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
                            });
                            props.setNum({
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
                            props.setNum({
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
                    <Radio.Group onChange={onChangeRadio}>
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
        </Drawer>
    )
};

export default MobileFilter;