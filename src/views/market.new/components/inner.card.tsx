import { Button, Spin } from "antd";
import { ReactElement, useContext, useState } from "react";
import { NFTItem, Type, web3 } from "../../../utils/types";
import { PNft } from "../../../App";
import { useNavigate } from "react-router-dom";
import IconFont from "../../../utils/icon";


const InnerCard = (props: { item: any }): ReactElement => {
    const { dispatch } = useContext(PNft);
    const navigate = useNavigate();
    const [player, setPlayer] = useState<any>();
    const [item, setItem] = useState<NFTItem>({
        ...props.item,
        play: false
    });
    return (
        <div className={`inner-card ${!props.item.price ? 'un-sale' : ''}`} onClick={() => {
            dispatch({
                type: Type.SET_INFO_ID,
                payload: {
                    info_id: String(props.item.fid)
                }
            });
            navigate('/detail')
        }}>
            <div className="nft-box">
                <div className="loading-box-public">
                    <Spin />
                </div>
                <img src={props.item.image_minio_url} alt="" />
                <div className="nft-tag">
                    <img src={require('../../../assets/new/plian_logo.png')} alt="" />
                </div>
                {props.item.voice_minio_url && <div className="play-btn" onClick={(e) => {
                    e.stopPropagation();
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
                    {
                        item.play
                            ? <IconFont type="icon-tingzhi" />
                            : <IconFont type="icon-play-fill" />
                    }
                </div>}
            </div>
            <div className="msg-box">
                <p className="nft-name">{props.item.file_name} #{props.item.token_id}</p>
                {props.item.price && <p className="price-text">{web3.utils.fromWei(props.item.price, 'ether')}&nbsp;{props.item.pay_currency_name}</p>}
                {props.item.price && <p className="last-price">Last sale:{`<`}&nbsp;{web3.utils.fromWei(props.item.last_price, 'ether')} {props.item.pay_currency_name}</p>}
            </div>
            <p className="oper-btn">
                <Button type="primary">Buy now</Button>
            </p>
        </div>
    )
};

export default InnerCard;