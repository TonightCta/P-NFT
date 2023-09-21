import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import './index.scss'
import FooterNew from "../screen.new/components/footer.new";
import { CompetitionList } from "../../request/api";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PNft } from "../../App";
import { Type } from "../../utils/types";

interface Data {
    competition_id: number,
    description: string,
    name: string,
    total_submit_items: number,
    end_time: number,
    start_time: number,
    poster_minio: string
}

export const LOCAL : string = process.env.REACT_APP_LOCAL as string;

const ContestView = (): ReactElement<ReactNode> => {
    const [data, setData] = useState<Data[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const { dispatch } = useContext(PNft);
    const navigate = useNavigate();
    const getDataList = async () => {
        setWait(true)
        const result = await CompetitionList({
            page_size: 100
        });
        setWait(false)
        const { data } = result;
        if(!data.data.item || LOCAL === 'online'){
            setData([]);
            return
        }
        setData(data.data.item);
    };
    useEffect(() => {
        getDataList();
    }, [])
    return (
        <div className="contest-view">
            <div className="page-inner">
                <p className="view-title">AI Contest</p>
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
                                                dispatch({
                                                    type: Type.SET_CONTEST_ID,
                                                    payload: {
                                                        contest_id: String(item.competition_id)
                                                    }
                                                })
                                                navigate('/contest-detail')
                                            }}>
                                                <div className="poster-box">
                                                    <div className="loading-box-public">
                                                        <Spin size="large"/>
                                                    </div>
                                                    <img className="poster-pic" src={item.poster_minio} alt="" />
                                                </div>
                                                <div className="msg-box">
                                                    <p className="text-overflow">{item.name}</p>
                                                    <div className="contest-msg">
                                                        <div className={`left-end ${(item.end_time - (new Date().getTime() / 1000)) < 1 ? 'end-point' : ''}`}>
                                                            <div className={`point`}>
                                                                <div className="point-inner"></div>
                                                            </div>
                                                            <p>{`${(item.end_time - (new Date().getTime() / 1000)) < 1 ? 'Ended' : `${Math.floor((item.end_time - (new Date().getTime() / 1000)) / 86400)} days left`}`}</p>
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