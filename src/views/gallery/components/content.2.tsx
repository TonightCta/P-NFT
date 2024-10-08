import { ReactElement, useContext, useEffect, useState } from "react";
import Content3 from "./content.3";
import { GalleryList, GalleryNFTList } from "../../../request/api";
import { Data } from "./top.screen";
import IconFont from "../../../utils/icon";
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import { Image, Spin } from 'antd'
import { ErrorCard } from "../../../components/error.card";

const ShowContent = (): ReactElement => {
    const [data, setData] = useState<Data[]>([]);
    const { state, dispatch } = useContext(PNft);
    const getInfo = async () => {
        if (state.gallery_two) {
            setData(JSON.parse(state.gallery_two));
            return
        }
        const result = await GalleryList({
            page_size: 100
        });
        const { data } = result;
        const lastShow = await GalleryNFTList({
            class_id: data.data.item[1].class_id,
            page_size: 3
        });
        const filter = lastShow.data.data.item?.map((item: any) => {
            return item = {
                ...item,
                load: true,
                error: false
            }
        })
        dispatch({
            type: Type.SET_GALLERY_TWO,
            payload: {
                gallery_two: filter
            }
        })
        setData(filter);
    };
    useEffect(() => {
        getInfo();
    }, [])
    return (
        <div className="show-content">
            <p className="content-title">
                <img src={require('../../../assets/new/gallery_icon_2.gif')} alt="" />
                Editor's Picks
            </p>
            <div className="content-1">
                <ul>
                    {
                        data.map((item: Data, index: number) => {
                            return (
                                <li key={index}>
                                    <div className="nft-box">
                                        <Image src={item.file_url} alt="" onLoad={() => {
                                            const updateList = [...data];
                                            if (updateList[index]) {
                                                updateList[index].load = !item.load;
                                                setData(updateList);
                                            }
                                        }} onError={() => {
                                            const updateList = [...data];
                                            if (updateList[index]) {
                                                updateList[index].error = !item.error;
                                                setData(updateList);
                                            }
                                        }} />
                                        {item.load && <div className="loading-box-public">
                                            <Spin size="large" />
                                        </div>}
                                        {item.error && <ErrorCard />}
                                    </div>
                                    <p className="nft-name">{item.file_name}</p>
                                    <div className="minter-msg">
                                        <img src={item.minter_url} alt="" />
                                        <p>{item.minter_name}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="ribbon-box">
                <ul>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8].map((item: number, index: number) => {
                            return (
                                <li key={index}>
                                    <IconFont type="icon-zixing" />
                                    <p>Pizzap AI Empowers Your Creative Inspiration</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            {/* <div className="content-2">
                <div className="content-2-inner">
                    <div className="left-msg">
                        <div className="creator-msg">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                            Ben Benhorin
                        </div>
                        <p className="msg-title">INSIDE ME</p>
                        <p className="msg-remark">The Cyclops Group is a group of artists, composers, cryptographers, and developers building networked narratives, collaborative games, and genre-bending experiences that embody the weirdness of the present. </p>
                    </div>
                    <div className="nft-box">
                        <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                    </div>
                </div>
            </div> */}
            <Content3 />
        </div>
    )
};

export default ShowContent;