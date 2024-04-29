import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";
import { CompetitionList } from "../../request/api";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PNft } from "../../App";
import { Type } from "../../utils/types";
import { computedCountdonw } from "../../utils";
import { ErrorCard } from "../../components/error.card";

interface Data {
    competition_id: number,
    description: string,
    name: string,
    total_submit_items: number,
    end_time: number,
    start_time: number,
    poster_url: string,
    load: boolean,
    error: boolean
}

export const LOCAL: string = process.env.REACT_APP_LOCAL as string;

const ContestView = (): ReactElement<ReactNode> => {
    const [data, setData] = useState<Data[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const { state, dispatch } = useContext(PNft);
    const navigate = useNavigate();
    const getDataList = async () => {
        if (state.campage_list) {
            setData(JSON.parse(state.campage_list));
            return
        }
        setWait(true)
        const result = await CompetitionList({
            page_size: 100
        });
        setWait(false)
        const { data } = result;
        if (!data.data.item || LOCAL === 'online') {
            setData([]);
            return
        };
        const filter = data.data.item?.map((item: any) => {
            return item = {
                ...item,
                load: true,
                error: false
            }
        })
        dispatch({
            type: Type.SET_CAMPAGE_LIST,
            payload: {
                campage_list: filter
            }
        })
        setData(filter);
    };
    const getNow = (): number => {
        const time = new Date().getTime() / 1000;
        return time
    }
    useEffect(() => {
        getDataList();
    }, [])
    return (
        <div className="contest-view">
            <div className="page-inner">
                <p className="view-title">AIGC Campaigns</p>
                {
                    wait
                        ? <div className="loading-box">
                            <Spin size="large" />
                        </div>
                        : <div className="data-list">
                            <ul>
                                {
                                    data.map((item: Data, index: number) => {
                                        return (
                                            <li key={index} onClick={() => {
                                                // dispatch({
                                                //     type: Type.SET_CONTEST_ID,
                                                //     payload: {
                                                //         contest_id: String(item.competition_id)
                                                //     }
                                                // })
                                                navigate(`/campaign/${item.competition_id}`)
                                            }}>
                                                <div className="poster-box">
                                                    {item.load && <div className="loading-box-public">
                                                        <Spin size="large" />
                                                    </div>}
                                                    {item.error && <ErrorCard />}
                                                    <img className="poster-pic" onLoad={() => {
                                                        const updataList = [...data];
                                                        if (updataList[index]) {
                                                            updataList[index].load = !item.load;
                                                            setData(updataList);
                                                        }
                                                    }} onError={() => {
                                                        const updataList = [...data];
                                                        if (updataList[index]) {
                                                            updataList[index].error = !item.error;
                                                            setData(updataList);
                                                        }
                                                    }} src={item.poster_url} alt="" />
                                                </div>
                                                <div className="msg-box">
                                                    <p className="text-overflow">{item.name}</p>
                                                    <div className="contest-msg">
                                                        <div className={`left-end ${(item.end_time - getNow()) < 1 ? 'end-point' : ''}`}>
                                                            <div className={`point`}>
                                                                <div className="point-inner"></div>
                                                            </div>
                                                            <p>{`${(item.end_time - getNow()) < 1 ? 'Ended' : `${computedCountdonw((item.start_time > getNow() ? item.start_time : item.end_time) - getNow()).D} days ${computedCountdonw((item.start_time > getNow() ? item.start_time : item.end_time) - getNow()).H} : ${computedCountdonw((item.start_time > getNow() ? item.start_time : item.end_time) - getNow()).M} ${(item.start_time > getNow() ? 'start' : 'left')}`}`}</p>
                                                        </div>
                                                        <div className="right-hot">
                                                            <p>🔥<span>{item.total_submit_items}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                }
                {
                    !wait && data.length === 0 && LOCAL !== 'online' && <p className="no-data">No Data</p>
                }
                {
                    !wait && data.length === 0 && LOCAL === 'online' && <div className="coming-box">
                        <img src={require('../../assets/new/coming_soon.png')} alt="" />
                        <p>Stay Tuned for something amazing!</p>
                    </div>
                }
            </div>
        <FooterNew />
        </div>
    )
};

export default ContestView;