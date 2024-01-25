import { Button, Spin, message } from "antd";
import { ReactElement, ReactNode, useContext, useState } from "react";
import { Data } from "..";
import { CompetitionVote } from '../../../request/api'
import { PNft } from "../../../App";
import { ErrorCard } from "../../../components/error.card";

const ContestCard = (props: { item: Data, upDate: () => void }): ReactElement<ReactNode> => {
    const { state } = useContext(PNft);
    const [item, setItem] = useState<Data>(props.item);
    const voteNFT = async () => {
        const result = await CompetitionVote({
            compitem_id: props.item.compitem_id,
            sender: state.address
        });
        const { status } = result;
        if (status !== 200) {
            message.error(result.msg);
            return
        };
        message.success('Voted successfully');
        props.upDate();
    }
    return (
        <div className="contest-card">
            <div className="nft-box">
                <img src={props.item.item_minio_url} alt="" onLoad={() => {
                    setItem({
                        ...item,
                        load: false
                    })
                }} onError={() => {
                    setItem({
                        ...item,
                        error: true
                    })
                }} />
                {item.load && <div className="loading-box">
                    <Spin />
                </div>}
                {item.error && <ErrorCard />}
                <div className="vote-num"><span>💗</span><p>{props.item.vote_amount}</p></div>
            </div>
            <p className="nft-name">{props.item.name}</p>
            <div className="owner-msg">
                <div className="owner">
                    <img src={props.item.submitter_avatar_url} alt="" />
                    <p>{props.item.submitter_name}</p>
                </div>
                <Button type="primary" onClick={voteNFT}>Vote</Button>
            </div>
        </div>
    )
};

export default ContestCard;