import { ReactElement, useEffect, useState } from "react";
import { GalleryList, GalleryNFTList, GroupList } from "../../../request/api";
import { Data } from "./top.screen";
import SeriesList from "./series.list";

interface Group {
    group_id: number;
    group_name: string,
    is_on: boolean
}

const Content3 = (): ReactElement => {
    const [data, setData] = useState<Data[]>([]);
    const [groupList, setGroupList] = useState<Group[]>([]);
    const getInfo = async () => {
        const result = await GalleryList({
            page_size: 100
        });
        const { data } = result;
        const lastShow = await GalleryNFTList({
            class_id: data.data.item[2].class_id,
            page_size:7
        });
        setData(lastShow.data.data.item);
    };
    const getGroupList = async () => {
        const result = await GroupList({
            page_size: 100
        });
        const { data } = result;
        const arr: Group[] = data.data.item.filter((e: Group) => {
            if (e.is_on) {
                return e
            }
        });
        setGroupList(arr);
    }
    useEffect(() => {
        getInfo();
        getGroupList();
    }, [])
    return (
        <div className="content-3">
            <div className="left-list">
                <div className="right-down">
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={data[0]?.file_minio_url} alt="" />
                        </div>
                        <p className="nft-name">{data[0]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[0]?.minter_minio_url} alt="" />
                            <p>{data[0]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[0]?.file_description}</p>
                    </div>
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={data[1]?.file_minio_url} alt="" />
                        </div>
                        <p className="nft-name">{data[1]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[1]?.minter_minio_url} alt="" />
                            <p>{data[0]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[0]?.file_description}</p>
                    </div>
                </div>
                <div className="public-card w-width">
                    <div className="nft-box">
                        <img src={data[2]?.file_minio_url} alt="" />
                    </div>
                    <p className="nft-name">{data[2]?.file_name}</p>
                    <div className="minter-msg">
                        <img src={data[2]?.minter_minio_url} alt="" />
                        <p>{data[2]?.minter_name}</p>
                    </div>
                    <p className="nft-remark">{data[2]?.file_description}</p>
                </div>
                <div className="left-down">
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={data[3]?.file_minio_url} alt="" />
                        </div>
                        <p className="nft-name">{data[3]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[3]?.minter_minio_url} alt="" />
                            <p>{data[3]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[3]?.file_description}</p>
                    </div>
                    <div className="public-card">
                        <div className="nft-box">
                            <img src={data[4]?.file_minio_url} alt="" />
                        </div>
                        <p className="nft-name">{data[4]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[4]?.minter_minio_url} alt="" />
                            <p>{data[4]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[4]?.file_description}</p>
                    </div>
                </div>
                <div className="public-card r-w-width">
                    <div className="nft-box">
                        <img src={data[5]?.file_minio_url} alt="" />
                    </div>
                    <p className="nft-name">{data[5]?.file_name}</p>
                    <div className="minter-msg">
                        <img src={data[5]?.minter_minio_url} alt="" />
                        <p>{data[5]?.minter_name}</p>
                    </div>
                    <p className="nft-remark">{data[5]?.file_description}</p>
                </div>
                <div className="public-card last-card">
                    <div className="nft-box">
                        <img src={data[6]?.file_minio_url} alt="" />
                    </div>
                    <p className="nft-name">{data[6]?.file_name}</p>
                    <div className="minter-msg">
                        <img src={data[4]?.minter_minio_url} alt="" />
                        <p>{data[6]?.minter_name}</p>
                    </div>
                    <p className="nft-remark">{data[6]?.file_description}</p>
                </div>
            </div>
            <div className="right-list">
                {
                    groupList.map((item: Group, index: number) => {
                        return (
                            <SeriesList key={index} id={item.group_id} name={item.group_name} />
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Content3;