import { ReactElement, useEffect, useState } from "react";
import NftCard from "../../../components/nft.card";
import { NFTMarketService } from '../../../request/api'
import { NFTItem } from "../../../utils/types";
import { Spin } from "antd";

const DiscoverList = (): ReactElement => {
    const [data, setData] = useState<NFTItem[]>([]);
    const [wait, setWait] = useState<boolean>(false);
    const getDataList = async () => {
        setWait(true);
        const result = await NFTMarketService({
            chain_id: "8007736",
            page_num: 1,
            page_size: 18
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