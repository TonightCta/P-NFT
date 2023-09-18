import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { CompetitionList, SubmitCompetition } from '../../../request/api'
import { PlianContractAddress721Main } from "../../../utils/source";
import { PNft } from "../../../App";

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
    total_submit_items: number
}

const EditWorkModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [active, setActive] = useState<number>(99);
    const [list, setList] = useState<Info[]>([]);
    const [comID, setComID] = useState<number>(0);
    const [wait, setWait] = useState<boolean>(false);
    const { state } = useContext(PNft);
    const getList = async () => {
        const result = await CompetitionList({
            page_size: 100
        });
        const { data } = result;
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
    const submitNFT = async () => {
        if (comID === 0) {
            message.error('Please select a competition');
            return
        };
        setWait(true);
        const params = {
            competition_id: comID,
            chain_id: "8007736",
            contract_address: PlianContractAddress721Main,
            token_id: props.work_id,
            sender: state.address
        };
        const result = await SubmitCompetition(params);
        setWait(false);
        const { status } = result;
        if (status !== 200) {
            message.error(result.msg);
            return
        };
        message.success('Successfully participated in the competition');
        close();
    }
    return (
        <Modal title="Participate in the competition" width={800} footer={null} open={visible} onCancel={close}>
            <div className="competition-list">
                {
                    list.length < 1
                        ? <div className="loading-box">
                            <Spin size="large" />
                        </div>
                        : <ul>
                            {
                                list.map((item: Info, index: number) => {
                                    return (
                                        <li key={index} className={`${active === index ? 'selected-contest' : ''}`} onClick={() => {
                                            setActive(index);
                                            setComID(item.competition_id)
                                        }}>
                                            <div className="poster-box">
                                                <img src={item.poster_minio} alt="" />
                                            </div>
                                            <p className="com-title text-overflow">{item.name}</p>
                                            <div className="com-msg">
                                                <div className="end-date">
                                                    <div className="point-box">
                                                        <div className="point-inner"></div>
                                                    </div>
                                                    <p>{Math.floor((item.end_time - (new Date().getTime() / 1000)) / 86400)}&nbsp;days left</p>
                                                </div>
                                                <p className="hot-num">🔥&nbsp;{item.total_submit_items}</p>
                                            </div>
                                            <div className="select-box">
                                                <CheckOutlined />
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                }
                <p className="submit-btn">
                    <Button type="default" onClick={close}>Cancel</Button>
                    <Button type="primary" disabled={wait} loading={wait} onClick={submitNFT}>Submit</Button>
                </p>
            </div>
        </Modal>
    )
};

export default EditWorkModal;