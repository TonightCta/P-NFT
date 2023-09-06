import { ReactElement, useContext } from "react";
import './index.scss'
import { NFTItem, Type, web3 } from "../../utils/types";
import { calsAddress } from "../../utils";
import { PNft } from "../../App";
import { useNavigate } from "react-router-dom";

interface Props {
    info: NFTItem
}

const NftCard = (props: Props): ReactElement => {
    const { dispatch } = useContext(PNft);
    const navigate = useNavigate();
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
                <img src={props.info.file_image_minio_url} alt="" />
            </div>
            <p>{props.info.file_name}</p>
            <div className="minter-msg">
                <div className="minter-avatar">
                    <img src={props.info.seller_avatar_url} alt="" />
                    <p>{calsAddress(props.info.seller)}</p>
                </div>
                <p className="price-text">{web3.utils.fromWei(props.info.price as string, 'ether')}&nbsp;{props.info.paymod}</p>
            </div>
        </div>
    )
};

export default NftCard;