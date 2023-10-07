import { ReactElement, useContext, useState } from "react";
import './index.scss'
import { NFTItem, Type, web3 } from "../../utils/types";
import { calsAddress } from "../../utils";
import { PNft } from "../../App";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import IconFont from "../../utils/icon";

interface Props {
    info: NFTItem
}

const NftCard = (props: Props): ReactElement => {
    const { dispatch } = useContext(PNft);
    const [item, setItem] = useState<NFTItem>({
        ...props.info,
        play: false
    });
    const navigate = useNavigate();
    const [player, setPlayer] = useState<any>();
    return (
        <div className="nft-card" onClick={() => {
            dispatch({
                type: Type.SET_INFO_ID,
                payload: {
                    info_id: String(props.info.fid)
                }
            });
            navigate('/detail')
        }}>
            <div className="nft-msg">
                <img src={props.info.file_image_minio_url ? props.info.file_image_minio_url : props.info.image_minio_url} alt="" />
                <div className="loading-box-public">
                    <Spin />
                </div>
                {props.info.file_voice_minio_url && <div className="play-btn" onClick={(e) => {
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
            <p>{props.info.file_name}</p>
            <div className="minter-msg">
                <div className="minter-avatar">
                    <img src={props.info.seller_avatar_url} alt="" />
                    <p>{calsAddress(props.info.seller)}</p>
                </div>
                <p className="price-text">{web3.utils.fromWei(props.info.price as string, 'ether')}&nbsp;{props.info.pay_currency_name}</p>
            </div>
        </div>
    )
};

export default NftCard;