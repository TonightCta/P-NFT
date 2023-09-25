import { Checkbox, Drawer, Radio, Space } from "antd";
import { ReactElement, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { CategoryList, LabelList } from "../../../request/api";
import type { RadioChangeEvent } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

interface Props {
    visible: boolean,
    closeDrawer: (val: boolean) => void,
    setStatus:(val:number) => void,
    setCategoryID:(val:number) => void,
    setLabelsID:(val:number[]) => void
}

interface Show {
    status: boolean,
    labels: boolean,
    category: boolean,
}

const MobileFilter = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [labelsList, setLabelsList] = useState<{ label_id: number, label_name: string }[]>([]);
    const [status, setStatus] = useState<number>(0);
    const [plainOptions, setPlainOptions] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<{ category_id: number, category_name: string }[]>([]);
    const onClose = () => {
        setVisible(false);
        props.closeDrawer(false);
    };
    const [show, setShow] = useState<Show>({
        status: true,
        labels: true,
        category: true,
    });
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