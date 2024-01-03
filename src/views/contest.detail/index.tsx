import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import './index.scss'
import { PNft } from "../../App";
import { Button, Pagination, Spin } from "antd";
import FooterNew from "../screen.new/components/footer.new";
import ContestCard from "./components/card";
import { CompetitionInfo, CompetitionNFTList } from '../../request/api'
import { DateConvert, computedCountdonw } from "../../utils/index";
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
    const [count, setCount] = useState<{ d: string, h: string, m: string, s: string }>({
        d: '00',
        h: '00',
        m: '00',
        s: '00'
    });
    const timer = useRef<NodeJS.Timer>();
    const getNow = (): number => {
        const time = new Date().getTime() / 1000;
        return time
    }
    const [page, setPage] = useState<{ num: number, total: number,size:number }>({
        num: 1,
        total: 10,
        size:12
    });
    const getInfo = async () => {
        const result = await CompetitionInfo({
            competition_id: +(searchParams.id as string)
        });
        const { data } = result;
        setInfo(data);
        if ((data!.end_time - getNow() + 286400) < 1) {
            return
        };
        timer.current = setInterval(() => {
            const { D, H, M, S } = computedCountdonw((data!.start_time > getNow() ? data!.start_time : data!.end_time) - getNow());
            setCount({
                d: D.toString(),
                h: H.toString(),
                m: M.toString(),
                s: S.toString()
            })
        }, 1000)
    };
    const [data, setData] = useState<Data[]>([]);
    const getDataList = async () => {
        setWait(true);
        const result = await CompetitionNFTList({
            competition_id: +(searchParams.id as string),
            page_size: page.size,
            page_num: page.num
        });
        const { data } = result;
        setWait(false);
        if (!data.data.item) {
            setPage({
                num: 1,
                total: 10,
                size:12
            });
            setData([]);
            return
        };
        setData(data.data.item);
        setPage({
            ...page,
            total: data.data.total
        });
    };
    useEffect(() => {
        getInfo();
    }, []);
    useEffect(() => {
        getDataList();
    }, [page.num,page.size])
    // const content = (
    //     <div>
    //         <ul>
    //             <li>123</li>
    //             <li>123</li>
    //             <li>123</li>
    //             <li>123</li>
    //         </ul>
    //     </div>
    // )
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
                        <div className="msg-title">
                            <p>{info?.name}</p>
                            <div className={`contest-status ${info?.end_time as number - getNow() < 1 ? 'end-s' : ''}`}>
                                {
                                    info?.end_time as number - getNow() < 1
                                        ? 'Ended'
                                        : info?.start_time as number > getNow() ? 'Not Started' : 'In Progress'
                                }
                            </div>
                        </div>
                        <div className="active-msg">
                            <p>🔥<span>{info?.total_submit_items}</span></p>
                            <p>😊<span>{info?.total_view}</span></p>
                            <p className="date-text">
                                {DateConvert(info?.start_time as number)} ~ {DateConvert(info?.end_time as number)}
                            </p>
                        </div>
                        {info?.description && <div className="remark-text" dangerouslySetInnerHTML={{ __html: info.description }}>
                        </div>}
                        {/* {info?.start_time && <div className="date-msg">
                            <div className={`end-msg ${(info!.end_time - getNow() + 286400) < 1 ? 'end-point' : ''}`}>
                                <div className="point">
                                    <div className="point-inner"></div>
                                </div>
                                <p>{`${(info!.end_time - getNow() + 286400) < 1 ? 'Ended' : `${count.d} days ${count.h} : ${count.m} : ${count.s} left`}`}</p>
                            </div>
                        </div>} */}
                        <div className="submit-work">
                            <div className={`end-msg mobild-end-msg ${(info?.end_time as number - getNow()) < 1 ? 'end-point' : ''}`}>
                                <div className="point">
                                    <div className="point-inner"></div>
                                </div>
                                {
                                    info?.end_time as number - getNow() < 1
                                    ? <p>Ended</p>
                                    : <p>{`${info?.start_time as number > getNow() ? 'Start' : 'End'} in ${count.d} days ${count.h} : ${count.m} : ${count.s}`}</p>
                                }
                            </div>
                            <Button type="primary" disabled={info?.start_time as number > getNow() || info?.end_time as number < getNow()} className={`${info?.start_time as number > getNow() || info?.end_time as number < getNow() ? 'dis-b' : ''}`} onClick={() => {
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
                                        <li key={index} className={`${Number(index) === active ? 'active-f' : ''}`} onClick={() => { setAction(Number(index)) }}>{item}</li>
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
                    <Pagination hideOnSinglePage defaultCurrent={1} pageSize={page.size} total={page.total} onChange={(e,size) => {
                        setPage({
                            ...page,
                            num: e,
                            size:size
                        })
                    }} />
                    {!wait && data.length < 1 && <p className="no-data">No data</p>}
                </div>
            </div>
            <FooterNew />
        </div>
    )
};


export default ContestDetailView;