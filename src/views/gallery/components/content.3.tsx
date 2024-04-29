import { ReactElement, useContext, useEffect, useState } from "react";
import { GalleryList, GalleryNFTList, GroupList } from "../../../request/api";
import { Data } from "./top.screen";
import SeriesList from "./series.list";
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import { Image } from 'antd'

interface Group {
    group_id: number;
    group_name: string,
    is_on: boolean
}

const Content3 = (): ReactElement => {
    const [data, setData] = useState<Data[]>([]);
    const { state, dispatch } = useContext(PNft);
    const [groupList, setGroupList] = useState<Group[]>([]);
    const getInfo = async () => {
      if (state.gallery_three) {
            setData(JSON.parse(state.gallery_three));
            return
        }
        const result = await GalleryList({
            page_size: 100
        });
        const { data } = result;
        const lastShow = await GalleryNFTList({
            class_id: data.data.item[2].class_id,
            page_size: 7
        });
        const filter = lastShow.data.data.item?.map((item:any) => {
            return item = {
                ...item,
                load:true,
                error:false
            }
        })
        dispatch({
            type: Type.SET_GALLERY_THREE,
            payload: {
                gallery_three: filter
            }
        })
        setData(filter);
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
                            <Image src={data[0]?.file_url} alt="" onLoad={() => {
                                // data[0].load = !data[0].load;
                                // setData(data);
                            }}/>
                            {/* {data[0].load && <div className="loading-box-public">
                                <Spin size="large"/>
                            </div>} */}
                        </div>
                        <p className="nft-name">{data[0]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[0]?.minter_url} alt="" />
                            <p>{data[0]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[0]?.file_description}</p>
                    </div>
                    <div className="public-card">
                        <div className="nft-box">
                            <Image src={data[1]?.file_url} alt="" />
                        </div>
                        <p className="nft-name">{data[1]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[1]?.minter_url} alt="" />
                            <p>{data[0]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[0]?.file_description}</p>
                    </div>
                </div>
                <div className="public-card w-width">
                    <div className="nft-box">
                        <Image src={data[2]?.file_url} alt="" />
                    </div>
                    <p className="nft-name">{data[2]?.file_name}</p>
                    <div className="minter-msg">
                        <img src={data[2]?.minter_url} alt="" />
                        <p>{data[2]?.minter_name}</p>
                    </div>
                    <p className="nft-remark">{data[2]?.file_description}</p>
                </div>
                <div className="left-down">
                    <div className="public-card">
                        <div className="nft-box">
                            <Image src={data[3]?.file_url} alt="" />
                        </div>
                        <p className="nft-name">{data[3]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[3]?.minter_url} alt="" />
                            <p>{data[3]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[3]?.file_description}</p>
                    </div>
                    <div className="public-card">
                        <div className="nft-box">
                            <Image src={data[4]?.file_url} alt="" />
                        </div>
                        <p className="nft-name">{data[4]?.file_name}</p>
                        <div className="minter-msg">
                            <img src={data[4]?.minter_url} alt="" />
                            <p>{data[4]?.minter_name}</p>
                        </div>
                        <p className="nft-remark">{data[4]?.file_description}</p>
                    </div>
                </div>
                <div className="public-card r-w-width">
                    <div className="nft-box">
                        <Image src={data[5]?.file_url} alt="" />
                    </div>
                    <p className="nft-name">{data[5]?.file_name}</p>
                    <div className="minter-msg">
                        <img src={data[5]?.minter_url} alt="" />
                        <p>{data[5]?.minter_name}</p>
                    </div>
                    <p className="nft-remark">{data[5]?.file_description}</p>
                </div>
                <div className="public-card last-card">
                    <div className="nft-box">
                        <Image src={data[6]?.file_url} alt="" />
                    </div>
                    <p className="nft-name">{data[6]?.file_name}</p>
                    <div className="minter-msg">
                        <img src={data[4]?.minter_url} alt="" />
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