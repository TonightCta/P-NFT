import { ReactElement, useState } from "react";
import IconFont from '../../../utils/icon';
import { Checkbox, Popover, Radio, Space } from "antd";
import InnerCard from "./inner.card";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { RadioChangeEvent } from 'antd';

interface Show {
    status: boolean,
    labels: boolean,
    category: boolean,
    filter: boolean
}

const ListCard = (): ReactElement => {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const onChange = (checkedValues: CheckboxValueType[]) => {
        console.log('checked = ', checkedValues);
    };
    const [sort, setSort] = useState<boolean>(false);
    const [value, setValue] = useState(1);
    const [show, setShow] = useState<Show>({
        status: true,
        labels: true,
        category: true,
        filter: true
    })
    const onChangeRadio = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    const handleOpenChange = (newOpen: boolean) => {
        setSort(newOpen);
    };
    const content = (
        <div className="sort-popover-box">
            <ul onClick={() => {
                setSort(false)
            }}>
                <li>123123</li>
                <li>123123</li>
                <li>123123</li>
                <li>123123</li>
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
                    <input type="text" placeholder="Search by name or description" />
                </div>
                <div className="sort-box">
                    <Popover open={sort} onOpenChange={handleOpenChange} content={content} placement="bottom" trigger={['click']}>
                        <div className="sort-inner">
                            <p>Price low to high</p>
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
                            <li>All</li>
                            <li><p className="point"></p>Listed</li>
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
                        <Radio.Group onChange={onChangeRadio} value={value}>
                            <Space direction="vertical">
                                <Radio value={1}>Option A</Radio>
                                <Radio value={2}>Option B</Radio>
                                <Radio value={3}>Option C</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
                <div className={`list-box ${!show.filter ? 'more-items' : ''}`}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item: number, index: number) => {
                            return (
                                <InnerCard key={index} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
};

export default ListCard;