import { ReactElement, useContext, useEffect, useState } from "react";
import { Pagination } from 'antd';
import { NFTLogsService } from '../../../request/api';
import { PNft } from "../../../App";
import { web3 } from "../../../utils/types";
import { calsAddress } from "../../../utils";
import IconFont from "../../../utils/icon";

const TabHistory = (props:{tokenID:number,address:string,image_minio_url:string,price:string,paymod:string}): ReactElement => {
    const { state } = useContext(PNft);
    const [data, setData] = useState<any[]>([]);
    const logsListFN = async () => {
        const result = await NFTLogsService({
            chain_id: process.env.REACT_APP_CHAIN,
            contract_address: props.address,
            token_id: props.tokenID,
            page_size: 200,
            page_num: 1
        });
        // console.log(result);
        if (!result.data.data.item) {
            setData([])
            return
        }
        setData(result.data.data.item);
    };
    useEffect(() => {
        logsListFN();
    }, [])
    return (
        <div className="trade-history-list">
            <p className="list-title">
                <IconFont type="icon-detail" />
                Item Activity
            </p>
            <div className="list-content">
                <div className="content-title">
                    <ul>
                        <li>Type</li>
                        <li>Item</li>
                        <li>Price</li>
                        <li>From</li>
                        <li>To</li>
                        <li>Date</li>
                    </ul>
                </div>
                <div className="content-data">
                    {
                        data.length < 1 && <p className="no-data">No Data</p>
                    }
                    {
                        data.map((item: any, index: number): ReactElement => {
                            return (
                                <ul key={index}>
                                    <li>
                                        <p>Listing</p>
                                        <p className="color-g">as fixed price</p>
                                    </li>
                                    <li>
                                        <div className="with-img">
                                            <img src={props.image_minio_url} alt="" />
                                            <div className="name-msg">
                                                <p className="color-g">PAI SPACE</p>
                                                <p>*****</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        {/* <p>$64321.12</p> */}
                                        <p className="color-g">{Number(web3.utils.fromWei(props.price, 'ether')).toFixed(2)}&nbsp;{props.paymod}</p>
                                    </li>
                                    <li>
                                        <p>{calsAddress(item.From)}</p>
                                    </li>
                                    <li>
                                        <p>{calsAddress(item.ContractAddress)}</p>
                                    </li>
                                    <li>
                                        <p className="color-g">{item.Time}</p>
                                    </li>
                                </ul>
                            )
                        })
                    }
                </div>
            </div>
            {data.length > 0 && <div className="page-oper">
                <Pagination defaultCurrent={1} total={data.length} onChange={() => {
                    window.scrollTo({
                        top: 700,
                        behavior: 'smooth'
                    })
                }} />
            </div>}
        </div>
    )
};

export default TabHistory;