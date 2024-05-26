import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, message, Image } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Base64ToFile, CompressImage, GetUrlKey } from "../../../utils";
import axios from "axios";
import { useHackathon } from "../../../hooks/hackthon";
import { PNft } from "../../../App";
import { MemeAddress } from "../../../utils/source";
import { web3 } from "../../../utils/types";
import IconFont from "../../../utils/icon";

interface Input {
  img: {
    view: string;
    source: string | File;
  };
  name: string;
  desc: string;
  amount: string | number;
  address: string;
}

interface Coll {
  title: string;
  list: string[];
}

interface Word {
  title: string;
  coll: Coll[];
}

const WordList: Word[] = [
  {
    title: "Style",
    coll: [
      {
        title: "Style",
        list: [
          "Renaissance",
          "Fauvism",
          "Cubism",
          "Abstract Art",
          "Surrealism",
          "OP Art /Optical Art",
          "Victorian",
          "Futuristic",
          "Minimalist",
          "Brutalist",
          "Miyazaki Hayao style",
        ],
      },
    ],
  },
  {
    title: "Scenes",
    coll: [
      {
        title: "Scenes",
        list: [
          "Dystopia,Anti-utopia",
          "Fantasy",
          "Galaxy",
          "Whimsically",
          "Universe I Cosmos",
          "Forest",
          "Ruins",
          "City",
          "Deserted city buildings",
          "Near future city",
        ],
      },
    ],
  },
  {
    title: "Elements",
    coll: [
      {
        title: "Elements",
        list: [
          "Robot",
          "Elf",
          "Angel",
          "Portrait",
          "Goddess",
          "Game CG",
          "Bishounen",
          "Cowboy",
          "Dog",
          "Cat",
          "Rabbit",
          "Starry Sky",
          "River",
          "Ocean",
          "Skyscraper",
        ],
      },
    ],
  },
  {
    title: "Visual Effect",
    coll: [
      {
        title: "Visual Effect",
        list: [
          "Cinematic Lighting",
          "God Rays",
          "Sunlight",
          "Reflection Light",
          "Depth Offield",
          "Full body",
          "Profile",
          "POV",
          "First-Person View",
          "Masterpiece",
        ],
      },
    ],
  },
  {
    title: "Posture",
    coll: [
      {
        title: "Posture",
        list: [
          "Yoga",
          "Pray",
          "Salute",
          "Gill Support",
          "Walk",
          "Sitting",
          "Standing",
          "Lying",
          "Selfie",
          "Wariza",
          "Princess carry",
        ],
      },
    ],
  },
];

const HackthonTheme: string[] = [
  "Apple Pie",
  "Lunch",
  "Dragen",
  "Christmas",
  "All Saints’ Day",
];

const SubmitWorkModal = (props: {
  visible: boolean;
  hackthon_id: number;
  min: number;
  openSuccess: (val: number) => void;
  onClose: (val: boolean) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const { QueryERC20Approve, SubmitHackathon, ApproveToken } = useHackathon();
  const [loading, setLoading] = useState<boolean>(false);
  const { state } = useContext(PNft);
  const [wordListS, setWordList] = useState<string[]>([]);
  const [type, setType] = useState<number>(1);
  const [active, setActive] = useState<number>(0);
  const [input, setInput] = useState<Input>({
    img: {
      view: "",
      source: "",
    },
    name: "",
    desc: "",
    amount:props.min ? props.min : '',
    address: GetUrlKey("referrer", window.location.href) || '',
  });
  const [collList, setCollList] = useState<Coll[]>(WordList[0].coll);
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
    console.log('0xbd19c55ceaed0bf7b71cc939316971e8c640730e'.length)
  }, [props.visible]);
  const uploadFile = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setInput({
        ...input,
        img: {
          source: file,
          view: URL.createObjectURL(file),
        },
      });
    });
  };
  const [aiImageView, setAiImageView] = useState<{
    url: string;
    minio_key: string;
    ipfs: string;
    file_name: string;
  }>({
    url: "",
    minio_key: "",
    ipfs: "",
    file_name: "",
  });
  useEffect(() => {
    props.min && setInput({
      ...input,
      amount:+props.min / 1e18
    })
  },[props.min])
  const uploadFileFN = async (_file_name: string, _file: any) => {
    if (!_file) {
      return;
    }
    const formData = new FormData();
    const fileSize = _file.size / (1024 * 1024);
    if (fileSize > 5) {
      message.warning("The maximum file size is 5MB.");
      return;
    }
    formData.append("file", _file);
    formData.append("name", _file_name);
    const result = await axios.post(
      `${process.env.REACT_APP_BASEURL_IPFS}/upload-file`,
      formData
    );
    return result.data.data;
  };
  const submitWork = async () => {
    if (!input.img.source && type === 2) {
      message.error("Please upload the NFT");
      return;
    }
    if (!aiImageView.ipfs && type === 1) {
      message.error("Please upload generate the NFT");
      return;
    }
    if (!input.amount) {
      message.error("Please enter the contribution amount");
      return;
    }
    if (+input.amount < 0) {
      message.error("Please enter the correct contribution amount");
      return;
    }
    if(input.address && input.address.length !== 42){
      message.error('Please enter the correct wallet address');
      return
    }
    if(input.address && input.address.substring(0,2) !== '0x'){
      message.error('Please enter the correct wallet address');
      return
    }
    if(input.address === state.address){
      message.error('The same wallet address cannot be recommended');
      return
    }
    setLoading(true);
    const query = await QueryERC20Approve(state.address as string, MemeAddress);
    const queryNum = +web3.utils.fromWei(String(query), "ether");
    if (queryNum < 0.01) {
      const approve: any = await ApproveToken(MemeAddress);
      if (!approve || approve.message) {
        setLoading(false);
        return;
      }
      submitWork();
      return;
    }
    const ipfs =
      type === 2
        ? await uploadFileFN(`${Date.now()}.png`, input.img.source)
        : { ipfshash: aiImageView.ipfs };
    const { ipfshash } = ipfs;
    const result: any = await SubmitHackathon(
      props.hackthon_id,
      ipfshash,
      +input.amount,
      input.address
    );
    setLoading(false);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success("Submit successful");
    setVisible(false);
    props.onClose(false);
    props.openSuccess(props.hackthon_id);
    setInput({
      amount: "",
      img: {
        view: "",
        source: "",
      },
      name: "",
      desc: "",
      address: GetUrlKey("referrer", window.location.href) || '',
    });
    setWordList([]);
    setAiImageView({
      ...aiImageView,
      url: "",
    });
  };
  const [imageWait, setImageWait] = useState<boolean>(false);

  const uploadFileImageAi = async () => {
    if (wordListS.length < 1) {
      message.error("Please select keywords");
      return;
    }
    setImageWait(true);
    const result: any = await axios.post(
      `${process.env.REACT_APP_BASEURL_AI}/text2img`,
      {
        prompts: `${wordListS.join(",")}`,
      }
    );
    setImageWait(false);
    const { data } = result;
    const { errcode } = data;
    if (errcode !== 0) {
      message.error(data.message);
      return;
    }
    setAiImageView({
      url: data.img_url_minio.file_url,
      minio_key: data.img_url_minio.minio_key,
      ipfs: data.img_url_ipfs,
      file_name: "",
    });
  };
  return (
    <Modal
      title={<p className="center-modal-title">Submit</p>}
      open={visible}
      footer={null}
      width={920}
      className="work-modal-custom"
      onCancel={() => {
        props.onClose(false);
        setVisible(false);
      }}
    >
      <div className="work-inner">
        <div className="tabs">
          <ul>
            <li
              className={`${type === 1 ? "active-type" : ""}`}
              onClick={() => {
                setType(1);
              }}
            >
              Design
            </li>
            <li
              className={`${type === 2 ? "active-type" : ""}`}
              onClick={() => {
                setType(2);
              }}
            >
              Upload
            </li>
          </ul>
        </div>
        {type === 1 ? (
          <div className="design-box">
            <p className="title">
              <IconFont type="icon-tupian" />
              <sup>*</sup>
              Image or 3D Model
            </p>
            <div className="word-title">
              <ul>
                {WordList.map((item: Word, index: number) => {
                  return (
                    <li
                      key={index}
                      className={`${active === index ? "active-tab" : ""}`}
                      onClick={() => {
                        setActive(index);
                        setCollList(item.coll);
                      }}
                    >
                      <p>{item.title}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="word-inner">
              {collList.map((item: Coll, index: number) => {
                return (
                  <div className="inner-b" key={`${index}-b`}>
                    <p className="b-name">{item.title}</p>
                    <ul>
                      {item.list.map((item: string, index: number) => {
                        return (
                          <li
                            key={`${index}-c`}
                            className={`${
                              wordListS.indexOf(item) > -1 ? "select-word" : ""
                            }`}
                            onClick={() => {
                              const arr = wordListS;
                              arr.indexOf(item) > -1
                                ? arr.splice(arr.indexOf(item), 1)
                                : arr.push(item);
                              setWordList([...arr]);
                            }}
                          >
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="word-inner n-t">
              <div className="inner-b">
                <p className="b-name">Hackthon Element</p>
                <ul>
                  {HackthonTheme.map((item: string, index: number) => {
                    return (
                      <li
                        key={`${index}-c-2`}
                        className={`${
                          wordListS.indexOf(item) > -1 ? "select-word" : ""
                        }`}
                        onClick={() => {
                          const arr = wordListS;
                          arr.indexOf(item) > -1
                            ? arr.splice(arr.indexOf(item), 1)
                            : arr.push(item);
                          setWordList([...arr]);
                        }}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="review-box">
              <div className="pmts-box">
                <p className="title">
                  <sup>*</sup>Prompts
                </p>
                <div className="word-review">
                  <p>{wordListS.join(",")}</p>
                </div>
              </div>
              <div className="view-box">
                <p className="title">
                  <sup>*</sup>Preview
                </p>
                <div className="im-box">
                  <Image src={aiImageView.url} />
                </div>
              </div>
            </div>
            <p className="gen">
              <Button
                type="primary"
                loading={imageWait}
                className={`${wordListS.length < 1 ? "dis-btn" : ""}`}
                disabled={imageWait || wordListS.length < 1}
                onClick={uploadFileImageAi}
              >
                Generate image
              </Button>
            </p>
            <ul className="inp-ul">
              <li>
                <p>
                  <sup>*</sup>Contribution Amount
                </p>
                <input
                  type="number"
                  placeholder={`Min ${+props.min / 1e18}`}
                  value={input.amount}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      amount: e.target.value,
                    });
                  }}
                />
              </li>
              <li>
                <p>Referrer</p>
                <input
                  type="text"
                  placeholder="Please enter the referrer address"
                  value={input.address}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      address: e.target.value,
                    });
                  }}
                />
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <ul className="inp-ul">
              <li>
                <p>
                  <sup>*</sup>Name
                </p>
                <input
                  type="text"
                  placeholder="Please enter the NFT name"
                  value={input.name}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      name: e.target.value,
                    });
                  }}
                />
              </li>
              <li>
                <p>
                  <sup>*</sup>
                  Description
                </p>
                <textarea
                  placeholder="Please enter the NFT desctiption"
                  value={input.desc}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      desc: e.target.value,
                    });
                  }}
                ></textarea>
              </li>
              <li>
                <p>
                  <sup>*</sup>Contribution Amount
                </p>
                <input
                  type="number"
                  placeholder={`Min ${+props.min / 1e18}`}
                  value={input.amount}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      amount: e.target.value,
                    });
                  }}
                />
              </li>
              <li>
                <p>Referrer</p>
                <input
                  type="text"
                  placeholder="Please enter the referrer address"
                  value={input.address}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      address: e.target.value,
                    });
                  }}
                />
              </li>
              <li>
                <p>
                  <sup>*</sup>Upload cover image
                </p>
                <div className="upload-nft-box">
                  {!input.img.view ? (
                    <div className="up-box">
                      <img
                        src={require("../../../assets/images/up_file.png")}
                        alt=""
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          uploadFile(e);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="review-box">
                      <div className="img-box">
                        <img src={input.img.view} alt="" />
                      </div>
                      <div
                        className="delete-btn"
                        onClick={() => {
                          setInput({
                            ...input,
                            img: {
                              source: "",
                              view: "",
                            },
                          });
                        }}
                      >
                        <CloseOutlined />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
        )}
        <p className="submit" onClick={submitWork}>
          <Button type="primary" loading={loading} disabled={loading}>
            Submit
          </Button>
        </p>
      </div>
    </Modal>
  );
};
export default SubmitWorkModal;
