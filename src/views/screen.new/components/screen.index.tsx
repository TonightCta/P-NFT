import { Spin } from "antd";
import { ReactElement, useEffect, useState } from "react";
import IconFont from '../../../utils/icon';
import { Screen1List } from '../../../request/api'

interface Data {
    file_minio_url: string,
    hposter_id: number
}

const PosterMobile : string[] = [
    require('../../../assets/mobile/poster_o_1.jpeg'),
    require('../../../assets/mobile/poster_o_2.jpeg'),
    require('../../../assets/mobile/poster_o_3.jpeg'),
    require('../../../assets/mobile/poster_o_4.jpeg'),
    require('../../../assets/mobile/poster_o_5.jpeg'),
    require('../../../assets/mobile/poster_o_6.jpeg'),
    require('../../../assets/mobile/poster_o_7.jpeg'),
    require('../../../assets/mobile/poster_o_8.jpeg'),
    require('../../../assets/mobile/poster_o_9.jpeg'),
    require('../../../assets/mobile/poster_o_10.jpeg'),
    require('../../../assets/mobile/poster_o_11.jpeg'),
    require('../../../assets/mobile/poster_o_12.jpeg'),
    require('../../../assets/mobile/poster_o_13.jpeg'),
    require('../../../assets/mobile/poster_o_14.jpeg'),
    require('../../../assets/mobile/poster_o_15.jpeg'),
]

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
                {/* <p>
                    <Button type="primary">Enter</Button>
                </p> */}
            </div>
            <div className="right-screen-banner">
                <div className="bottom-mask"></div>
                <div className="pc-list">
                    <ul className="ani-1">
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
                    <ul className="ani-2">
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
                    <ul className="ani-3">
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
                <div className="mobile-list">
                    <ul className="ani-1">
                        {
                            PosterMobile.slice(0,5).map((item: string, index: number) => {
                                return (
                                    <li key={index}>
                                        <img src={item} alt="" />
                                        <div className="loading-box-public">
                                            <Spin />
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul className="ani-2">
                        {
                            PosterMobile.slice(5, 10).map((item: string, index: number) => {
                                return (
                                    <li key={index}>
                                        <img src={item} alt="" />
                                        <div className="loading-box-public">
                                            <Spin />
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul className="ani-3">
                        {
                            PosterMobile.slice(10, 15).map((item: string, index: number) => {
                                return (
                                    <li key={index}>
                                        <img src={item} alt="" />
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
        </div>
    )
};

export default ScreenIndexNew;