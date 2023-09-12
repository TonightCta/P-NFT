import { ReactElement, useEffect, useState } from "react";
import Content3 from "./content.3";
import { GalleryList, GalleryNFTList, GalleryPeriodList } from "../../../request/api";
import { Data } from "./top.screen";
import IconFont from "../../../utils/icon";

const ShowContent = (): ReactElement => {
    const [data, setData] = useState<Data[]>([]);
    const getInfo = async () => {
        const result = await GalleryList({
            page_size: 100
        });
        const { data } = result;
        const periods = await GalleryPeriodList({
            class_id: data.data.item[1].class_id
        });
        const arr = periods.data.data.item.filter((item: any) => {
            if (item.is_default) {
                return item
            }
        })
        const lastShow = await GalleryNFTList({
            series_id: arr[0].series_id,
            page_size:3
        });
        setData(lastShow.data.data.item);
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
                                        <img src={item.file_minio_url} alt="" />
                                    </div>
                                    <p className="nft-name">{item.file_name}</p>
                                    <div className="minter-msg">
                                        <img src={item.minter_minio_url} alt="" />
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