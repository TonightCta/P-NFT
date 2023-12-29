import { Button, Modal, Spin, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { CompetitionList, SubmitCompetition } from '../../../request/api'
import { PNft } from "../../../App";
import { LOCAL } from "../../contest";
import { FilterAddress } from "../../../utils";
import { DownOutlined } from "@ant-design/icons";

interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
    work_id: number
}

interface Info {
    competition_id: number,
    is_online: boolean,
    poster_minio: string,
    name: string,
    start_time: number,
    end_time: number,
    total_submit_items: number,
    description: string,
    wait: boolean,
    more: boolean
}

const EditWorkModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [list, setList] = useState<Info[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const { state } = useContext(PNft);
    const getList = async () => {
        setWait(true)
        const result = await CompetitionList({
            page_size: 100
        });
        setWait(false)
        const { data } = result;
        if (!data.data.item || LOCAL === 'online') {
            setList([]);
            return
        };
        setList(data.data.item.filter((item: Info) => { return item.is_online }))
    }
    useEffect(() => {
        setVisible(props.visible);
        props.visible && getList();
    }, [props.visible]);
    const close = () => {
        setVisible(false);
        props.closeModal(false);
    };
    const Card = (props: { item: Info, work_id: number }) => {
        const [item, setItem] = useState<Info>(props.item);
        const submitNFT = async (_com_id: number) => {
            setItem({
                ...item,
                wait: true,
                more: false
            });
            const params = {
                competition_id: _com_id,
                chain_id: state.chain,
                contract_address: FilterAddress(state.chain as string).contract_721,
                token_id: props.work_id,
                sender: state.address
            };
            const result = await SubmitCompetition(params);
            setItem({
                ...item,
                wait: false
            });
            const { status } = result;
            if (status !== 200) {
                message.error(result.msg);
                return
            };
            message.success('Successfully participated in the competition');
            close();
        };
        useEffect(() => {
            setItem(props.item);
        }, [props.item]);
        return (
            <>
                <div className="poster-box">
                    <img src={item.poster_minio} alt="" />
                </div>
                <div className="right-oper">
                    <div className={`msg-top-box ${item.more ? 'show-desc' : ''}`}>
                        <p className="com-title text-overflow">{item.name}</p>
                        <div className="com-remark" dangerouslySetInnerHTML={{ __html: item.description }}></div>
                        <div className="show-more">
                            <div className="btn-i" onClick={() => {
                                setItem({
                                    ...item,
                                    more: !item.more
                                })
                            }}>
                                <p>{item.more ? 'Hide' : 'Show'}</p>
                                <DownOutlined />
                            </div>
                        </div>
                    </div>
                    <div className="com-msg">
                        <div className="left-i">
                            <div className="end-date">
                                <div className="point-box">
                                    <div className="point-inner"></div>
                                </div>
                                <p>{Math.floor((item.end_time - (new Date().getTime() / 1000)) / 86400)}&nbsp;days left</p>
                            </div>
                            <p className="hot-num">🔥&nbsp;{item.total_submit_items}{ }</p>
                        </div>
                        <Button loading={item.wait} disabled={item.wait} type="primary" onClick={() => {
                            submitNFT(item.competition_id)
                        }}>Submit</Button>
                    </div>
                </div>
            </>
        )
    }
    return (
        <Modal destroyOnClose title="Participate in the campaign" width={800} footer={null} open={visible} onCancel={close}>
            <div className="competition-list">
                {
                    wait
                        ? <div className="loading-box">
                            <Spin size="large" />
                        </div>
                        : <ul>
                            {
                                list.map((item: Info, index: number) => {
                                    return (
                                        <li key={index}>
                                            <Card item={item} work_id={props.work_id} />
                                        </li>
                                    )
                                })
                            }
                            {
                                list.length < 1 && <li className="no-data">
                                    <p>Coming Soon</p>
                                </li>
                            }
                        </ul>
                }
                {/* <p className="submit-btn">
                    <Button type="default" onClick={close}>Cancel</Button>
                    <Button type="primary" disabled={wait} loading={wait} onClick={submitNFT}>Submit</Button>
                </p> */}
            </div>
        </Modal>
    )
};

export default EditWorkModal;