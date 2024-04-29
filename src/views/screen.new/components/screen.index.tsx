import { Spin } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import IconFont from "../../../utils/icon";
import { Screen1List, ShowScreenList } from "../../../request/api";
import { PNft } from "../../../App";
import { Type } from "../../../utils/types";
import { ErrorCard } from "../../../components/error.card";

interface Data {
  file_minio_url: string;
  file_url: string;
  hposter_id: number;
  load: boolean;
  error: boolean;
}

// const PosterMobile: string[] = [
//     require('../../../assets/mobile/poster_o_1.jpeg'),
//     require('../../../assets/mobile/poster_o_2.jpeg'),
//     require('../../../assets/mobile/poster_o_3.jpeg'),
//     require('../../../assets/mobile/poster_o_4.jpeg'),
//     require('../../../assets/mobile/poster_o_5.jpeg'),
//     require('../../../assets/mobile/poster_o_6.jpeg'),
//     require('../../../assets/mobile/poster_o_7.jpeg'),
//     require('../../../assets/mobile/poster_o_8.jpeg'),
//     require('../../../assets/mobile/poster_o_9.jpeg'),
//     require('../../../assets/mobile/poster_o_10.jpeg'),
//     require('../../../assets/mobile/poster_o_11.jpeg'),
//     require('../../../assets/mobile/poster_o_12.jpeg'),
//     require('../../../assets/mobile/poster_o_13.jpeg'),
//     require('../../../assets/mobile/poster_o_14.jpeg'),
//     require('../../../assets/mobile/poster_o_15.jpeg'),
// ]

const ScreenIndexNew = (): ReactElement => {
  const [data, setData] = useState<Data[]>([]);
  const { state, dispatch } = useContext(PNft);
  const getDataList = async () => {
    if (state.screen_one) {
      setData(JSON.parse(state.screen_one));
      return;
    }
    const result = await ShowScreenList({
      page_size: 30,
      screen_no: 1,
    });
    const { data } = result;
    const filter = data.data.item?.map((item: any) => {
      return (item = {
        ...item,
        load: true,
        error: false,
      });
    });
    dispatch({
      type: Type.SET_SCREEN_ONE,
      payload: {
        screen_one: filter,
      },
    });
    setData(filter);
  };
  useEffect(() => {
    getDataList();
  }, []);
  return (
    <div className="screen-index-new">
      <div className="left-top-mask"></div>
      <div className="left-text">
        <IconFont type="icon-zixing" className="star-1" />
        <IconFont type="icon-zixing" className="star-2" />
        <IconFont type="icon-zixing" className="star-3" />
        <p>AI Empowers Your</p>
        <p>Creative</p>
        <p className="with-bg">Inspiration</p>
        {/* <p>
                    <Button type="primary">Enter</Button>
                </p> */}
      </div>
      <div className="right-screen-banner">
        <div className="bottom-mask"></div>
        <div className="pc-list">
          <ul className="ani-1">
            {data.slice(0, 10).map((item: Data, index: number) => {
              return (
                <li key={index}>
                  <img
                    src={item.file_url}
                    alt=""
                    onLoad={() => {
                      const updataList = [...data];
                      if (updataList[index]) {
                        updataList[index].load = !item.load;
                        setData(updataList);
                      } else {
                        console.log("Invalid index");
                      }
                    }}
                    onError={() => {
                      console.log("er");
                      const updataList = [...data];
                      if (updataList[index]) {
                        console.log(updataList[index].error);
                        updataList[index].error = !item.error;
                        setData(updataList);
                      } else {
                        console.log("Invalid index");
                      }
                    }}
                  />
                  {/* 
                                        TODO
                                        onError={() => {
                                            const updataList = [...data];
                                            if (updataList[index]) {
                                                updataList[index].error = !item.error;
                                                setData(updataList);
                                            } else {
                                                console.log('Invalid index')
                                            }
                                        }}
                                         */}
                  {item.load && (
                    <div className="loading-box-public">
                      <Spin />
                    </div>
                  )}
                  {item.error && <ErrorCard />}
                </li>
              );
            })}
          </ul>
          <ul className="ani-2">
            {data.slice(10, 20).map((item: Data, index: number) => {
              return (
                <li key={index}>
                  <img
                    src={item.file_url}
                    alt=""
                    onLoad={() => {
                      const updataList = [...data];
                      if (updataList[index]) {
                        updataList[index].load = !item.load;
                        setData(updataList);
                      } else {
                        console.log("Invalid index");
                      }
                    }}
                    onError={() => {
                      console.log("er");
                      const updataList = [...data];
                      if (updataList[index]) {
                        console.log(updataList[index].error);
                        updataList[index].error = !item.error;
                        setData(updataList);
                      } else {
                        console.log("Invalid index");
                      }
                    }}
                  />
                  {item.load && (
                    <div className="loading-box-public">
                      <Spin />
                    </div>
                  )}
                  {item.error && <ErrorCard />}
                </li>
              );
            })}
          </ul>
          <ul className="ani-3">
            {data.slice(20, 30).map((item: Data, index: number) => {
              return (
                <li key={index}>
                  <img
                    src={item.file_url}
                    alt=""
                    onLoad={() => {
                      const updataList = [...data];
                      if (updataList[index]) {
                        updataList[index].load = !item.load;
                        setData(updataList);
                      } else {
                        console.log("Invalid index");
                      }
                    }}
                    onError={() => {
                      const updataList = [...data];
                      if (updataList[index]) {
                        console.log(updataList[index].error);
                        updataList[index].error = !item.error;
                        setData(updataList);
                      } else {
                        console.log("Invalid index");
                      }
                    }}
                  />
                  {item.load && (
                    <div className="loading-box-public">
                      <Spin />
                    </div>
                  )}
                  {item.error && <ErrorCard />}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mobile-list">
          <ul className="ani-1">
            {data.slice(0, 5).map((item: Data, index: number) => {
              return (
                <li key={index}>
                  <img src={item.file_url} alt="" />
                  {item.load && (
                    <div className="loading-box-public">
                      <Spin />
                    </div>
                  )}
                  {item.error && <ErrorCard />}
                </li>
              );
            })}
          </ul>
          <ul className="ani-2">
            {data.slice(5, 10).map((item: Data, index: number) => {
              return (
                <li key={index}>
                  <img src={item.file_url} alt="" />
                  {item.load && (
                    <div className="loading-box-public">
                      <Spin />
                    </div>
                  )}
                  {item.error && <ErrorCard />}
                </li>
              );
            })}
          </ul>
          <ul className="ani-3">
            {data.slice(10, 15).map((item: Data, index: number) => {
              return (
                <li key={index}>
                  <img src={item.file_url} alt="" />
                  {item.load && (
                    <div className="loading-box-public">
                      <Spin />
                    </div>
                  )}
                  {item.error && <ErrorCard />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScreenIndexNew;
