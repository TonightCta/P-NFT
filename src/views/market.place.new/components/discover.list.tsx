import { ReactElement, useContext, useEffect, useState } from "react";
import NftCard from "../../../components/nft.card";
import { NFTMarketService } from '../../../request/api'
import { NFTItem, Type } from "../../../utils/types";
import { Button, Spin } from "antd";
import IconFont from "../../../utils/icon";
import { PNft } from "../../../App";
import { useNavigate } from "react-router-dom";

const DiscoverList = (): ReactElement => {
    const [data, setData] = useState<NFTItem[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const { dispatch } = useContext(PNft);
    const navigate = useNavigate();
    const getDataList = async () => {
        setWait(true);
        const result = await NFTMarketService({
            chain_id: "8007736",
            page_num: 1,
            page_size: 20
        });
        const { data } = result;
        setWait(false);
        setData(data.data.item);
    };
    useEffect(() => {
        getDataList();
    }, [])
    return (
        <div className="discover-card">
            <div className="card-title-filter">
                <p className="title-tag">Discover</p>
                <div className="view-more">
                    <Button type="default" onClick={() => {
                        dispatch({
                            type: Type.SET_COLLECTION_ID,
                            payload: {
                                collection_id: "1"
                            }
                        });
                        navigate('/market')
                    }}>
                        View More
                        <IconFont type="icon-arrow-up-right" />
                    </Button>
                </div>
            </div>
            {wait && <div className="loading-mask">
                <Spin size="large" />
            </div>}
            <div className="card-list">
                {
                    data.map((item: NFTItem, index: number) => {
                        return (
                            <NftCard key={index} info={item} />
                        )
                    })
                }
            </div>
        </div>
    )
};

export default DiscoverList;