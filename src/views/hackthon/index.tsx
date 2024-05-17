import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import "./index.scss";
import FooterNew from "../screen.new/components/footer.new";
import CardLan from "./components/card";
import { CollectionList } from "../../request/api";
import { Button, Spin } from "antd";
import { PNft } from "../../App";
import { Type } from "../../utils/types";
import LaunchModal from "./components/launch.modal";

export interface Col {
  bg_image_url: string;
  category_id: number;
  chain_id: string;
  collection_description: string;
  collection_id: number;
  collection_name: string;
  contract_address: string;
  creat_time: number;
  poster_url: string;
  total_supply: number;
  current_supply: number;
  loading: boolean;
}

const HackthonView = (): ReactElement<ReactNode> => {
  const [data, setData] = useState<Col[]>([]);
  const { state, dispatch } = useContext(PNft);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible,setVisible] = useState<boolean>(false);
  const getList = async () => {
    if (state.launchpad) {
      setData(JSON.parse(state.launchpad));
      return;
    }
    setLoading(true);
    const result = await CollectionList({
      is_launchpad: true,
      page_size: 100,
      page_num: 1,
    });
    setLoading(false);
    const { data } = result;
    const filter = data.data.item.map((item: any) => {
      return (item = {
        ...item,
        loading: true,
      });
    });
    setData(filter);
    dispatch({
      type: Type.SET_LAUNCHPAD,
      payload: {
        launchpad: filter,
      },
    });
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="hackthon-view">
      <div className="mask-box">
        <img
          src={require("../../assets/new/voice_nft_mask.png")}
          className="left-mask"
          alt=""
        />
        <img
          src={require("../../assets/new/voice_nft_mask.png")}
          className="right-mask"
          alt=""
        />
      </div>
      <div className="hackthon-inner">
        <div className="title-oper">
          <p className="view-title">Meme Hackthon</p>
          <Button type="primary" onClick={() => {
            setVisible(true);
          }}>Launch</Button>
        </div>
        {loading ? (
          <div className="load-box">
            <Spin size="large" className="n-t" />
          </div>
        ) : (
          <div className="data-list">
            {data.map((item: Col, index: number) => {
              return <CardLan key={index} {...item} />;
            })}
          </div>
        )}
      </div>
      <LaunchModal visible={visible} onClose={(val:boolean) => {
        setVisible(val);
      }}/>
      <FooterNew />
    </div>
  );
};

export default HackthonView;
