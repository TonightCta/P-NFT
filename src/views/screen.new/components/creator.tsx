import { Spin } from "antd";
import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { Screen2List, ShowScreenList } from '../../../request/api'
import { useNavigate } from "react-router-dom";
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import { ErrorCard } from "../../../components/error.card";

interface Card {
    file_minio_url: string,
    file_url:string,
    file_name: string,
    minter_url: string,
    minter_name: string,
    minter: string,
    load:boolean,
    error:boolean
}
// const MobileCardLisr: Card[] = [
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_1.jpeg'),
//         file_name: 'Imaginary City',
//         minter_minio_url: 'https://minio.pizzap.io/pizzap/avatar1695221625?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231007T070213Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a867360bb321a788fd3386d5406be7e71b2df9d8346d90bff4ab3cb123a0d169',
//         minter_name: 'Matthew',
//         minter: ''
//     },
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_2.jpeg'),
//         file_name: 'Imaginary City',
//         minter_minio_url: 'https://minio.pizzap.io/pizzap/avatar1695221625?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231007T070213Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a867360bb321a788fd3386d5406be7e71b2df9d8346d90bff4ab3cb123a0d169',
//         minter_name: 'Matthew',
//         minter: ''
//     },
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_3.jpeg'),
//         file_name: 'Basketball Girl',
//         minter_minio_url: '',
//         minter_name: 'Carl',
//         minter: ''
//     },
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_4.jpeg'),
//         file_name: 'Basketball Girl',
//         minter_minio_url: 'https://minio.pizzap.io/pizzap/avatar1695221625?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231007T070213Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a867360bb321a788fd3386d5406be7e71b2df9d8346d90bff4ab3cb123a0d169',
//         minter_name: 'Carl',
//         minter: ''
//     },
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_5.jpeg'),
//         file_name: 'Imaginary City',
//         minter_minio_url: 'https://minio.pizzap.io/pizzap/avatar1695221625?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231007T070213Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a867360bb321a788fd3386d5406be7e71b2df9d8346d90bff4ab3cb123a0d169',
//         minter_name: 'Matthew',
//         minter: ''
//     },
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_6.jpeg'),
//         file_name: 'Scenery in Dreams',
//         minter_minio_url: 'https://minio.pizzap.io/pizzap/avatar1695221625?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231007T070213Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a867360bb321a788fd3386d5406be7e71b2df9d8346d90bff4ab3cb123a0d169',
//         minter_name: 'Jordan',
//         minter: ''
//     },
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_7.jpeg'),
//         file_name: 'Colorful Summer Day',
//         minter_minio_url: 'https://minio.pizzap.io/pizzap/avatar1695221625?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231007T070213Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a867360bb321a788fd3386d5406be7e71b2df9d8346d90bff4ab3cb123a0d169',
//         minter_name: 'Brown',
//         minter: ''
//     },
//     {
//         file_minio_url: require('../../../assets/mobile/poster_t_8.jpeg'),
//         file_name: 'Noble Girl',
//         minter_minio_url: 'https://minio.pizzap.io/pizzap/avatar1695221625?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20231007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231007T070213Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a867360bb321a788fd3386d5406be7e71b2df9d8346d90bff4ab3cb123a0d169',
//         minter_name: 'Delia',
//         minter: ''
//     },
// ]

const CreatorWapper = (): ReactElement<ReactNode> => {
    const [data, setData] = useState<Card[]>([]);
    const { state, dispatch } = useContext(PNft);
    const getDataList = async () => {
        if (state.screen_two) {
            setData(JSON.parse(state.screen_two));
            return
        }
        const result = await ShowScreenList({
            page_size: 24,
            screen_no:2
        });
        const { data } = result;
        const filter = data.data.item?.map((item:any) => {
            return item = {
                ...item,
                load:true,
                error:false
            }
        })
        dispatch({
            type: Type.SET_SCREEN_TWO,
            payload: {
                screen_two: filter
            }
        });
        //TODO voice_ipfs
        setData(filter);
    };
    const navigate = useNavigate();
    useEffect(() => {
        getDataList();
    }, [])
    const CreatorCard = (props: { item: Card }) => {
        const [itemInfo,setItemInfo] = useState<Card>(props.item)
        return (
            <div className="creator-card">
                {itemInfo.load && <div className="loading-box-public">
                    <Spin />
                </div>}
                {itemInfo.error && <ErrorCard/>}
                <div className="nft-box">
                    <img src={itemInfo.file_url} alt="" onLoad={() => {
                        setItemInfo({
                            ...itemInfo,
                            load:!itemInfo.load
                        })
                    }} onError={() => {
                        setItemInfo({
                            ...itemInfo,
                            error:!itemInfo.error
                        })
                    }}/>
                </div>
                <p>{itemInfo.file_name}</p>
                <div className="account-box">
                    <img src={itemInfo.minter_url} alt="" />
                    <p>{itemInfo.minter_name}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="creator-wapper">
            <p className="wapper-title">
                <img src={require('../../../assets/new/fire.gif')} alt="" />
                Hot NFTs
            </p>
            <div className="list-box">
                <ul className="c-mobile">
                    {
                        data.slice(0, 4).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul className="c-mobile">
                    {
                        data.slice(4, 8).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        data.slice(0, 4).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        data.slice(4, 8).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        data.slice(8, 12).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        data.slice(12, 16).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul>
                    {
                        data.slice(16, 20).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
                <ul className="no-right">
                    {
                        data.slice(20, 25).map((item: Card, index: number) => {
                            return (
                                <li key={index} onClick={() => {
                                    navigate(`/user/${item.minter}`)
                                }}>
                                    <CreatorCard item={item} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            {/* <p className="view-more">
                <Button type="default">
                    View More
                    <IconFont type="icon-arrow-up-right" />
                </Button>
            </p> */}
            <div className="mask-box"></div>
        </div>
    )
};

export default CreatorWapper;