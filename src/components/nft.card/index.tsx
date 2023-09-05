import { ReactElement } from "react";
import './index.scss'
import { NFTItem, web3 } from "../../utils/types";
import { calsAddress } from "../../utils";

interface Props {
    info: NFTItem
}

const NftCard = (props: Props): ReactElement => {
    return (
        <div className="nft-card">
            <div className="nft-msg">
                <img src={props.info.file_image_minio_url} alt="" />
            </div>
            <p>{props.info.file_name}</p>
            <div className="minter-msg">
                <div className="minter-avatar">
                    <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                    <p>{calsAddress(props.info.seller)}</p>
                </div>
                <p className="price-text">{web3.utils.fromWei(props.info.price as string, 'ether')}&nbsp;{props.info.paymod}</p>
            </div>
        </div>
    )
};

export default NftCard;