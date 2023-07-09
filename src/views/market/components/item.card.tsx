import { ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NFTItem, Type, web3 } from "../../../utils/types";
import { Button, Popconfirm, Spin, message } from "antd";
import { PNft } from "../../../App";
import FixedModal from "../../detail/components/fixed.price";
import { MFTOffService } from "../../../request/api";
import { useContract } from "../../../utils/contract";
import { CaretRightOutlined } from "@ant-design/icons";
import IconFont from "../../../utils/icon";

interface Props {
    item: NFTItem,
    upload?: () => void,
    uploadSell?: () => void,
}

const CardItem = (props: Props): ReactElement => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(PNft);
    const [item, setItem] = useState<NFTItem>(props.item);
    const { takeOff } = useContract();
    const [fixedVisible, setFixedVisible] = useState<boolean>(false);
    const [player, setPlayer] = useState<any>();
    const confirm = async () => {
        const hash: any = await takeOff(+item.order_id);
        if (!hash || hash.message) {
            return
        };
        const maker = await MFTOffService({
            chain_id: '8007736',
            sender: state.address,
            tx_hash: hash['transactionHash']
        });
        const { status } = maker;
        if (status !== 200) {
            message.error(maker.message);
            return
        };
        message.success('Take off the shelves Successful!');
        props.uploadSell && props.uploadSell()
    };
    return (
        <div className="market-card" onClick={() => {
            item.price && dispatch({
                type: Type.SET_CARD,
                payload: {
                    card: item
                }
            })
            item.price && navigate('/detail')
        }}>
            <div className="play-btn" onClick={(e) => {
                e.stopPropagation();
                if (!item.file_voice_ipfs) {
                    message.error('Failed')
                    return
                };
                if (item.play) {
                    player.pause();
                    setItem({
                        ...item,
                        play: false
                    });
                    setPlayer(null);
                    return
                }
                const play = document.createElement('audio');
                setPlayer(play)
                play.src = item.file_voice_ipfs;
                play.loop = false;
                play.play();
                setItem({
                    ...item,
                    play: true
                });
            }}>
                {item.play ? <IconFont type="icon-tingzhi" /> : <CaretRightOutlined />}
            </div>
            <div className="img-box">
                <img src={item.file_image_ipfs} onLoad={() => {
                    setItem({
                        ...item,
                        load: false
                    })
                }} alt="" />
                {item.load && <div className="load-box">
                    <Spin />
                </div>}
            </div>
            <p className="card-type">BabyBunny</p>
            <div className="other-msg">
                <p>XXXX #{item.token_id}</p>
                {
                    item.price
                        ? <p>{Number(web3.utils.fromWei(item.price, 'ether')).toFixed(2)}&nbsp;{item?.paymod}</p>
                        : item.off ?
                            <Popconfirm
                                title="Take off the shelves"
                                description="Are you sure to take off the shelves?"
                                onConfirm={confirm}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button >Take Off</Button>
                            </Popconfirm> : <Button type="primary" onClick={() => {
                                setFixedVisible(true)
                            }}>Sell</Button>
                }
            </div>
            <FixedModal upRefresh={() => {
                props.upload && props.upload();
            }} sell visible={fixedVisible} image={item.file_image_ipfs} id={item.token_id} closeModal={(val: boolean) => {
                setFixedVisible(val);
            }} />
        </div>
    )
};

export default CardItem;