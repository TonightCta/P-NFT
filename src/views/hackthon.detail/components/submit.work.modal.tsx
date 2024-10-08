import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, message, Image } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Base64ToFile, CompressImage, GetUrlKey } from "../../../utils";
import axios from "axios";
import { useHackathon } from "../../../hooks/hackthon";
import { PNft } from "../../../App";
import { web3 } from "../../../utils/types";
import IconFont from "../../../utils/icon";
import { useSwitchChain } from "../../../hooks/chain";
import { useContract } from "../../../utils/contract";

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
  chain_id: string;
  pay_token_address: string;
  create_address: string;
  pay_token_symbol: string;
  pay_token_url: string;
  openSuccess: (val: number) => void;
  onClose: (val: boolean) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const { QueryERC20Approve, SubmitHackathon, ApproveToken } = useHackathon();
  const [loading, setLoading] = useState<{ approve: boolean; submit: boolean }>(
    {
      approve: false,
      submit: false,
    }
  );
  const [disable, setDisable] = useState<{ approve: boolean; submit: boolean }>(
    {
      approve: true,
      submit: true,
    }
  );
  const { state } = useContext(PNft);
  const [wordListS, setWordList] = useState<string[]>([]);
  const [type, setType] = useState<number>(1);
  const [active, setActive] = useState<number>(0);
  const { switchC } = useSwitchChain();
  const { balanceErc20 } = useContract();
  const [prompts, setPrompts] = useState<string>("");
  const [input, setInput] = useState<Input>({
    img: {
      view: "",
      source: "",
    },
    name: "",
    desc: "",
    amount: props.min ? props.min : "",
    address: GetUrlKey("referrer", window.location.href) || "",
  });
  const [collList, setCollList] = useState<Coll[]>(WordList[0].coll);
  const queryToken = async () => {
    const query = await QueryERC20Approve(
      props.pay_token_address,
      state.address as string,
      props.create_address
    );
    const queryNum = +web3.utils.fromWei(String(query), props.pay_token_symbol === 'TRUMP' ? 'Gwei' : "ether");
    if (queryNum < 1) {
      setDisable({
        approve: false,
        submit: true,
      });
    } else {
      setDisable({
        approve: true,
        submit: false,
      });
    }
  };
  const approveTokenInn = async () => {
    setLoading({
      ...loading,
      approve: true,
    });
    const approve: any = await ApproveToken(
      props.pay_token_address,
      props.create_address
    );
    setLoading({
      ...loading,
      approve: false,
    });
    if (!approve || approve.message) {
      message.error(approve.message);
      return;
    }
    queryToken();
  };
  const clear = () => {
    setInput({
      amount: props.min ? props.min : "",
      img: {
        view: "",
        source: "",
      },
      name: "",
      desc: "",
      address: GetUrlKey("referrer", window.location.href) || "",
    });
    setWordList([]);
    setAiImageView({
      ...aiImageView,
      url: "",
    });
    setDisable({
      approve: true,
      submit: true,
    });
    setType(1);
  };
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
    !!props.visible && queryToken();
    !props.visible && clear();
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
    props.min &&
      setInput({
        ...input,
        amount: props.min,
      });
  }, [props.min]);
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
    if (+input.amount < props.min) {
      message.error(`The minimum number of submissions is ${props.min}`);
      return;
    }
    if (input.address && input.address.length !== 42) {
      message.error("Please enter the correct wallet address");
      return;
    }
    if (input.address && input.address.substring(0, 2) !== "0x") {
      message.error("Please enter the correct wallet address");
      return;
    }
    if (input.address === state.address) {
      message.error("The same wallet address cannot be recommended");
      return;
    }
    const chain: any = await switchC(+props.chain_id);
    if (chain?.code) return;
    setLoading({
      ...loading,
      submit: true,
    });
    const balance = await balanceErc20(props.pay_token_address);
    if (+web3.utils.fromWei(balance,props.pay_token_symbol === 'TRUMP' ? 'Gwei' : 'ether') < +input.amount) {
      message.error("Your balance is insufficient");
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
      input.address,
      props.pay_token_symbol
    );
    setLoading({
      ...loading,
      submit: false,
    });
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success("Submit successful");
    setVisible(false);
    props.onClose(false);
    props.openSuccess(props.hackthon_id);
    clear();
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
              <p className="line"></p>
            </li>
            <li
              className={`${type === 2 ? "active-type" : ""}`}
              onClick={() => {
                setType(2);
              }}
            >
              Upload
              <p className="line"></p>
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
                  <textarea
                    placeholder="Type in the inscriber or customize the input, split by,"
                    value={`${wordListS.join(",")}${prompts}`}
                    onChange={(e) => {
                      setPrompts(
                        e.target.value.substring(wordListS.join(",").length)
                      );
                    }}
                  />
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
                  placeholder={`Min ${props.min}`}
                  value={input.amount}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      amount: e.target.value,
                    });
                  }}
                />
                <div className="token-box">
                  <img src={props.pay_token_url} alt="" />
                  <p>{props.pay_token_symbol}</p>
                </div>
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
              {/* <li>
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
              </li> */}
              <li>
                <p>
                  <sup>*</sup>Contribution Amount
                </p>
                <input
                  type="number"
                  placeholder={`Min ${props.min}`}
                  value={input.amount}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      amount: e.target.value,
                    });
                  }}
                />
                <div className="token-box">
                  <img src={props.pay_token_url} alt="" />
                  <p>{props.pay_token_symbol}</p>
                </div>
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
                      <PlusOutlined />
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
          <Button
            type="primary"
            loading={loading.approve}
            className={`${disable.approve ? "dis-btn" : ""}`}
            disabled={loading.approve || disable.approve}
            onClick={approveTokenInn}
          >
            Approve
          </Button>
          <Button
            type="primary"
            loading={loading.submit}
            disabled={loading.submit || disable.submit}
            className={`${disable.submit ? "dis-btn" : ""}`}
          >
            Submit
          </Button>
        </p>
        <p className={`line ${!disable.submit ? "c-line" : ""}`}>
          <span></span>
          <span></span>
        </p>
      </div>
    </Modal>
  );
};
export default SubmitWorkModal;
