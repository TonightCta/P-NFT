import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import { PNft } from "../../App";
import IconFont from "../../utils/icon";
import { Button, Pagination, Spin } from "antd";
import FooterNew from "../screen.new/components/footer.new";
import ContestCard from "./components/card";
import { CompetitionInfo, CompetitionNFTList } from '../../request/api'
import { DateConvert } from "../../utils/index";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

interface Info {
    bg_image_minio: string,
    name: string,
    logo_minio: string,
    start_time: number,
    end_time: number,
    description: string,
    total_submit_items: number,
    total_view: number,
}

export interface Data {
    item_minio_url: string,
    compitem_id: number,
    submitter: string,
    submitter_avatar_url: string,
    submitter_name: string,
    vote_amount: number,
    name: string
}

const ContestDetailView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const [active, setAction] = useState<number>(0);
    const [info, setInfo] = useState<Info>();
    const searchParams = useParams();
    const [wait, setWait] = useState<boolean>(false);
    const navigate = useNavigate();
    const [page, setPage] = useState<{ num: number, total: number }>({
        num: 1,
        total: 10
    });
    const getInfo = async () => {
        const result = await CompetitionInfo({
            competition_id: +(searchParams.id as string)
        });
        const { data } = result;
        setInfo(data);
    };
    const [data, setData] = useState<Data[]>([]);
    const getDataList = async () => {
        setWait(true);
        const result = await CompetitionNFTList({
            competition_id: +(searchParams.id as string),
            page_size: 12,
            page_num: page.num
        });
        const { data } = result;
        setWait(false);
        if (!data.data.item) {
            setPage({
                num: 1,
                total: 10
            });
            setData([]);
            return
        };
        setData(data.data.item);
        setPage({
            ...page,
            total: data.data.total
        });
    }
    useEffect(() => {
        getInfo();
    }, []);
    useEffect(() => {
        getDataList();
    }, [page.num])
    const content = (
        <div>
            <ul>
                <li>123</li>
                <li>123</li>
                <li>123</li>
                <li>123</li>
            </ul>
        </div>
    )
    return (
        <div className="contest-detail-view">
            <img className="top-bg" src={require('../../assets/new/contest_bg.png')} alt="" />
            <div className="detail-inner">
                <div className="info-card">
                    <div className="left-bg">
                        <img src={info?.bg_image_minio} alt="" />
                        <div className="loading-box">
                            <Spin size="large" />
                        </div>
                    </div>
                    <div className="right-msg">
                        <p className="msg-title">{info?.name}</p>
                        <div className="active-msg">
                            <p>🔥<span>{info?.total_submit_items}</span></p>
                            <p>😊<span>{info?.total_view}</span></p>
                        </div>
                        {info?.description && <div className="remark-text" dangerouslySetInnerHTML={{__html:info.description}}>
                        </div>}
                        {info?.start_time && <div className="date-msg">
                            {<p className="time-text">
                                <IconFont type="icon-timer" />
                                {DateConvert(info?.start_time as number)} ~ {DateConvert(info?.end_time as number)}
                            </p>}
                            <div className={`end-msg ${(info!.end_time - (new Date().getTime() / 1000)) < 1 ? 'end-point' : ''}`}>
                                <div className="point">
                                    <div className="point-inner"></div>
                                </div>
                                <p>{`${(info!.end_time - (new Date().getTime() / 1000)) < 1 ? 'Ended' : `${Math.floor((info!.end_time - (new Date().getTime() / 1000)) / 86400)} days left`}`}</p>
                            </div>
                        </div>}
                        <div className="submit-work">
                            {
                                info?.start_time && <div className={`end-msg mobild-end-msg ${(info!.end_time - (new Date().getTime() / 1000)) < 1 ? 'end-point' : ''}`}>
                                    <div className="point">
                                        <div className="point-inner"></div>
                                    </div>
                                    <p>{`${(info!.end_time - (new Date().getTime() / 1000)) < 1 ? 'Ended' : `${Math.floor((info!.end_time - (new Date().getTime() / 1000)) / 86400)} days left`}`}</p>
                                </div>
                            }
                            <Button type="primary" onClick={() => {
                                // dispatch({
                                //     type: Type.SET_OWNER_ADDRESS,
                                //     payload: {
                                //         owner_address: state.address as string
                                //     }
                                // });
                                // navigate('/owner')
                                navigate(`/user/${state.address}`)
                            }}>Submit your work</Button>
                        </div>
                    </div>
                </div>
                <div className="data-list">
                    <div className="filter-box">
                        <ul>
                            {
                                // 'Award-winning works', 'Introduction'
                                ['Art Works'].map((item: string, index: React.Key) => {
                                    return (
                                        <li key={index} className={`${+index === active ? 'active-f' : ''}`} onClick={() => { setAction(+index) }}>{item}</li>
                                    )
                                })
                            }
                        </ul>
                        {/* <div className="search-inp">
                            <IconFont type="icon-sousuo_search" />
                            <input type="text" placeholder="Search by name" />
                        </div>
                        <Popover content={content} title={null} placement="bottom">
                            <div className="sort-box">
                                <p>Votes high to low</p>
                                <IconFont type="icon-xiangxia" />
                            </div>
                        </Popover> */}
                    </div>
                    {
                        wait
                            ? <div className="load-box">
                                <Spin size="large" />
                            </div>
                            : <div className="data-inner">
                                {
                                    data.map((item: Data, index: React.Key) => {
                                        return (
                                            <ContestCard upDate={getDataList} key={index} item={item} />
                                        )
                                    })
                                }
                            </div>}
                    {data.length > 0 && <Pagination defaultCurrent={1} pageSize={12} total={page.total} onChange={(e) => {
                        setPage({
                            ...page,
                            num: e
                        })
                    }} />}
                    {!wait && data.length < 1 && <p className="no-data">No data</p>}
                </div>
            </div>
            <FooterNew />
        </div>
    )
};


export default ContestDetailView;