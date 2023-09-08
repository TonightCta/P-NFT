import { Button, Spin } from "antd";
import { ReactElement, useEffect, useState } from "react";
import IconFont from '../../../utils/icon';
import { Screen1List } from '../../../request/api'

interface Data {
    file_minio_url: string,
    hposter_id: number
}

const ScreenIndexNew = (): ReactElement => {
    const [data, setData] = useState<Data[]>([]);
    const getDataList = async () => {
        const result = await Screen1List({
            page_size: 30
        });
        const { data } = result;
        setData(data.data.item);
    };
    useEffect(() => {
        getDataList();
    }, []);
    return (
        <div className="screen-index-new">
            <div className="left-top-mask"></div>
            <div className="left-text">
                <IconFont type="icon-zixing" className="star-1" />
                <IconFont type="icon-zixing" className="star-2" />
                <IconFont type="icon-zixing" className="star-3" />
                <p>AI Empowers Your</p>
                <p>Creative</p>
                <p className="with-bg">Inspiration</p>
                <p>
                    <Button type="primary">Enter</Button>
                </p>
            </div>
            <div className="right-screen-banner">
                <div className="bottom-mask"></div>
                <ul>
                    {
                        data.slice(0, 10).map((item: Data, index: number) => {
                            return (
                                <li key={index}>
                                    <img src={item.file_minio_url} alt="" />
                                    <div className="loading-box-public">
                                        <Spin />
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        data.slice(10, 20).map((item: Data, index: number) => {
                            return (
                                <li key={index}>
                                    <img src={item.file_minio_url} alt="" />
                                    <div className="loading-box-public">
                                        <Spin />
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        data.slice(20, 30).map((item: Data, index: number) => {
                            return (
                                <li key={index}>
                                    <img src={item.file_minio_url} alt="" />
                                    <div className="loading-box-public">
                                        <Spin />
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default ScreenIndexNew;