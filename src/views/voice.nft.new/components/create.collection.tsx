import { ReactElement, useContext, useState } from "react";
import { Button, Select, Image, message } from "antd";
import { Base64ToFile, CompressImage } from "../../../utils";
import { CloseOutlined } from "@ant-design/icons";
import { useContract } from "../../../utils/contract";
import { PNft } from "../../../App";
import { Op } from "..";
import { CollectionMintService, UploadFileService } from "../../../request/api";
import { useSwitchChain } from "../../../hooks/chain";
import { useNavigate } from "react-router-dom";

export interface Input {
  name: string;
  desc: string;
  collection_type: string;
  symbol: string;
  tokenURI: string;
  decimals: string;
  native_supply: string;
  supply: string;
  limit: string;
  price: string;
  admin: string;
  website_link: string;
  twitter_link: string;
  discord_link: string;
  tg_link: string;
  medium_link: string;
  category: number;
}

interface UPFile {
  source: string | File;
  view: string;
}

const CreateCollection = (props: { cateList: Op[] }): ReactElement => {
  const { CreateCollectionWith721, CreateCollectionWith404 } = useContract();
  const { state } = useContext(PNft);
  const [loading, setLoading] = useState<boolean>(false);
  const { switchC } = useSwitchChain();
  const navigate = useNavigate();
  const [input, setInput] = useState<Input>({
    name: "",
    desc: "",
    collection_type: "721",
    symbol: "",
    tokenURI: "",
    decimals: "",
    native_supply: "",
    supply: "",
    limit: "",
    price: "",
    admin: state.address || "",
    website_link: "",
    twitter_link: "",
    discord_link: "",
    tg_link: "",
    medium_link: "",
    category: 1,
  });
  const [logoFile, setLogoFile] = useState<UPFile>({
    source: "",
    view: "",
  });
  const [posterFile, setPosterFile] = useState<UPFile>({
    source: "",
    view: "",
  });
  const [bgFile, setBgFile] = useState<UPFile>({
    source: "",
    view: "",
  });
  //Cover Image
  const selectCover = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setPosterFile({
        source: file,
        view: URL.createObjectURL(file),
      });
    });
  };
  //Logo Image
  const selectLogo = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setLogoFile({
        source: file,
        view: URL.createObjectURL(file),
      });
    });
  };
  //Background Image
  const selectBg = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setBgFile({
        source: file,
        view: URL.createObjectURL(file),
      });
    });
  };
  const uploadFileLocaFN = async (_file: any) => {
    if (!_file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", _file);
    const result = await UploadFileService(formData);
    return result.data;
  };
  const checkInput = () => {
    if (!state.address) {
      message.error("Please connect the wallet first");
      return "0";
    }
    if (!input.name) {
      message.error("Please enter the collection name");
      return "0";
    }
    if (!input.symbol) {
      message.error("Please enter the collection symbol");
      return "0";
    }
    if (!input.tokenURI) {
      message.error("Please enter the collection token URI");
      return "0";
    }
    if (!input.admin) {
      message.error("Please enter the collection admin address");
      return "0";
    }
    if (!logoFile.view) {
      message.error("Please upload logo file");
      return "0";
    }
    if (!posterFile.view) {
      message.error("Please upload poster file");
      return "0";
    }
    if (!bgFile.view) {
      message.error("Please upload background file");
      return "0";
    }
  };
  const resetInput = () => {
    setInput({
      name: "",
      desc: "",
      collection_type: "721",
      symbol: "",
      tokenURI: "",
      decimals: "",
      native_supply: "",
      supply: "",
      limit: "",
      price: "",
      admin: state.address || "",
      website_link: "",
      twitter_link: "",
      discord_link: "",
      tg_link: "",
      medium_link: "",
      category: 1,
    });
  };
  const createCollectionWith721 = async () => {
    const pass = checkInput();
    if (pass === "0") return;
    const r: any = await switchC(8007736);
    if (r.code) return;
    if (!input.supply) {
      message.error("Please enter the collection supply");
      return;
    }
    if (+input.supply < 0) {
      message.error("Please enter the correct supply");
      return;
    }
    if (!input.limit) {
      message.error("Please enter the collection limit");
      return;
    }
    if (+input.limit < 0) {
      message.error("Please enter the correct limit");
      return;
    }
    if (!input.price) {
      message.error("Please enter the collection price");
      return;
    }
    if (+input.price < 0) {
      message.error("Please enter the correct price");
      return;
    }
    setLoading(true);
    const result: any = await CreateCollectionWith721(
      input.name,
      input.symbol,
      input.tokenURI,
      +input.supply,
      +input.limit,
      +input.price,
      input.admin
    );
    setLoading(false);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    const logo_local = await uploadFileLocaFN(logoFile.source);
    const poster_local = await uploadFileLocaFN(posterFile.source);
    const bg_local = await uploadFileLocaFN(bgFile.source);
    const formdata = new FormData();
    formdata.append("chain_id", "8007736");
    formdata.append("trx_hash", result["transactionHash"]);
    formdata.append("sender", state.address as string);
    formdata.append("collection_name", input.name);
    formdata.append("collection_description", input.desc);
    formdata.append("contract_type", "ERC721");
    formdata.append("token_url", input.tokenURI);
    formdata.append("supply", input.supply);
    formdata.append("decimals", input.decimals);
    formdata.append("buy_limit", input.limit);
    formdata.append("sell_price", input.price);
    formdata.append("category_id", String(input.category));
    formdata.append("logo_file_name", logo_local.file_name);
    formdata.append("audio_file_name", "");
    formdata.append("poster_file_name", poster_local.file_name);
    formdata.append("bg_image_file_name", bg_local.file_name);
    formdata.append("website_link", input.website_link);
    formdata.append("twitter_link", input.twitter_link);
    formdata.append("discord_link", input.discord_link);
    formdata.append("tg_link", input.tg_link);
    formdata.append("medium_link", input.medium_link);
    const re = await CollectionMintService(formdata);
    const { status } = re;
    if (status !== 200) {
      message.error(re.msg);
      return;
    }
    message.success("Created successfully");
    resetInput();
    navigate("/collections");
  };
  const createCollectionWith404 = async () => {
    const pass = checkInput();
    if (pass === "0") return;
    const r: any = await switchC(8007736);
    if (r.code) return;
    if (!input.decimals) {
      message.error("Please enter the precision");
      return;
    }
    if (+input.decimals < 0) {
      message.error("Please enter the correct precision");
      return;
    }
    if (!input.native_supply) {
      message.error("Please enter the total native supply");
      return;
    }
    if (+input.native_supply < 0) {
      message.error("Please enter the correct total local supply");
      return;
    }
    setLoading(true);
    const result: any = await CreateCollectionWith404(
      input.name,
      input.symbol,
      input.tokenURI,
      +input.decimals,
      +input.native_supply,
      input.admin
    );
    if (!result || result.message) {
      message.error(result.message);
      setLoading(false);
      return;
    }
    const logo_local = await uploadFileLocaFN(logoFile.source);
    const poster_local = await uploadFileLocaFN(posterFile.source);
    const bg_local = await uploadFileLocaFN(bgFile.source);
    const formdata = new FormData();
    formdata.append("chain_id", "8007736");
    formdata.append("trx_hash", result["transactionHash"]);
    formdata.append("sender", state.address as string); 
    formdata.append("collection_name", input.name);
    formdata.append("collection_description", input.desc);
    formdata.append("contract_type", "ERC404");
    formdata.append("token_url", input.tokenURI);
    formdata.append("supply", input.supply);
    formdata.append("decimals", input.decimals);
    formdata.append("buy_limit", input.limit);
    formdata.append("sell_price", input.price);
    formdata.append("category_id", String(input.category));
    formdata.append("logo_file_name", logo_local.file_name);
    formdata.append("audio_file_name", "");
    formdata.append("poster_file_name", poster_local.file_name);
    formdata.append("bg_image_file_name", bg_local.file_name);
    formdata.append("website_link", input.website_link);
    formdata.append("twitter_link", input.twitter_link);
    formdata.append("discord_link", input.discord_link);
    formdata.append("tg_link", input.tg_link);
    formdata.append("medium_link", input.medium_link);
    const re = await CollectionMintService(formdata);
    setLoading(false);
    const { status } = re;
    if (status !== 200) {
      message.error(re.msg);
      return;
    }
    message.success("Created successfully");
    resetInput();
    navigate("/collections");
  };
  const selectCategory = (value: string) => {
    setInput({
      ...input,
      category: +value,
    });
  };
  return (
    <div className="create-collection">
      <div className="input-box">
        <div className="public-inp-box">
          <p>
            <sup>*</sup>Name
          </p>
          <input
            className="other-in"
            value={input.name}
            onChange={(e) => {
              setInput({
                ...input,
                name: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the name"
          />
        </div>
        <div className="public-inp-box">
          <p>
            <sup>*</sup>Symbol
          </p>
          <input
            className="other-in"
            value={input.symbol}
            onChange={(e) => {
              setInput({
                ...input,
                symbol: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the symbol"
          />
        </div>
        <div className="public-inp-box">
          <p>Describtion(Optional)</p>
          <textarea
            placeholder="Please enter the describtion"
            value={input.desc}
            onChange={(e) => {
              setInput({
                ...input,
                desc: e.target.value,
              });
            }}
          ></textarea>
        </div>
        <div className="public-inp-box">
          <p>
            <sup>*</sup>Category
          </p>
          <Select
            defaultValue="1"
            onChange={selectCategory}
            options={props.cateList}
          />
        </div>
        <div className="more-up-img">
          <div className="public-inp-box">
            <p>
              <sup>*</sup>Upload cover image
            </p>
            {!posterFile.view ? (
              <div className="upload-img-box">
                <input type="file" accept="image/*" onChange={selectCover} />
                <img
                  src={require("../../../assets/images/up_file.png")}
                  alt=""
                />
              </div>
            ) : (
              <div className="review-box">
                <div className="review-inner">
                  <Image width={250} src={posterFile.view} />
                </div>
                <div
                  className="delete-file"
                  onClick={() => {
                    setPosterFile({
                      source: "",
                      view: "",
                    });
                  }}
                >
                  <CloseOutlined />
                </div>
              </div>
            )}
            <p className="up-remark">
              File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB,
              GLTF. Max size: 100 MB
            </p>
          </div>
          <div className="public-inp-box">
            <p>
              <sup>*</sup>Upload logo
            </p>
            {!logoFile.view ? (
              <div className="upload-img-box">
                <input type="file" accept="image/*" onChange={selectLogo} />
                <img
                  src={require("../../../assets/images/up_file.png")}
                  alt=""
                />
              </div>
            ) : (
              <div className="review-box">
                <div className="review-inner">
                  <Image width={250} src={logoFile.view} />
                </div>
                <div
                  className="delete-file"
                  onClick={() => {
                    setLogoFile({
                      source: "",
                      view: "",
                    });
                  }}
                >
                  <CloseOutlined />
                </div>
              </div>
            )}
            <p className="up-remark">
              File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB,
              GLTF. Max size: 100 MB
            </p>
          </div>
        </div>
        <div className="public-inp-box">
          <p>
            <sup>*</sup>Upload background image
          </p>
          {!bgFile.view ? (
            <div className="upload-img-box">
              <input type="file" accept="image/*" onChange={selectBg} />
              <img src={require("../../../assets/images/up_file.png")} alt="" />
            </div>
          ) : (
            <div className="review-box review-box-w">
              <div className="review-inner">
                <Image width={"100%"} src={logoFile.view} />
              </div>
              <div
                className="delete-file"
                onClick={() => {
                  setBgFile({
                    source: "",
                    view: "",
                  });
                }}
              >
                <CloseOutlined />
              </div>
            </div>
          )}
          <p className="up-remark">
            File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB, GLTF.
            Max size: 100 MB
          </p>
        </div>
        <div className="public-inp-box">
          <p>
            <sup>*</sup>Collection Type
          </p>
          <Select
            value={input.collection_type}
            onChange={(val: string) => {
              setInput({
                ...input,
                collection_type: val,
              });
            }}
            options={[
              { value: "721", label: "ERC721" },
              { value: "404", label: "ERC404" },
            ]}
          />
        </div>
        <div className="public-inp-box">
          <p>
            <sup>*</sup>Token URI
          </p>
          <input
            className="other-in"
            value={input.tokenURI}
            onChange={(e) => {
              setInput({
                ...input,
                tokenURI: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the token uri"
          />
        </div>
        {input.collection_type === "404" && (
          <div className="public-inp-box">
            <p>
              <sup>*</sup>Decimals
            </p>
            <input
              className="other-in"
              onWheel={(event) => (event.target as HTMLElement).blur()}
              value={input.decimals}
              onChange={(e) => {
                setInput({
                  ...input,
                  decimals: e.target.value,
                });
              }}
              type="number"
              placeholder="Please enter the decimals"
            />
          </div>
        )}
        {input.collection_type === "404" && (
          <div className="public-inp-box">
            <p>
              <sup>*</sup>Total Native Supply
            </p>
            <input
              className="other-in"
              onWheel={(event) => (event.target as HTMLElement).blur()}
              value={input.native_supply}
              onChange={(e) => {
                setInput({
                  ...input,
                  native_supply: e.target.value,
                });
              }}
              type="number"
              placeholder="Please enter the total native supply"
            />
          </div>
        )}
        {input.collection_type === "721" && (
          <div className="public-inp-box">
            <p>
              <sup>*</sup>Supply
            </p>
            <input
              className="other-in"
              onWheel={(event) => (event.target as HTMLElement).blur()}
              value={input.supply}
              onChange={(e) => {
                setInput({
                  ...input,
                  supply: e.target.value,
                });
              }}
              type="number"
              placeholder="Please enter the supply"
            />
          </div>
        )}
        {input.collection_type === "721" && (
          <div className="public-inp-box">
            <p>
              <sup>*</sup>Limit
            </p>
            <input
              className="other-in"
              onWheel={(event) => (event.target as HTMLElement).blur()}
              value={input.limit}
              onChange={(e) => {
                setInput({
                  ...input,
                  limit: e.target.value,
                });
              }}
              type="number"
              placeholder="Please enter the limit"
            />
          </div>
        )}
        {input.collection_type === "721" && (
          <div className="public-inp-box">
            <p>
              <sup>*</sup>Price
            </p>
            <input
              className="other-in"
              onWheel={(event) => (event.target as HTMLElement).blur()}
              value={input.price}
              onChange={(e) => {
                setInput({
                  ...input,
                  price: e.target.value,
                });
              }}
              type="number"
              placeholder="Please enter the price"
            />
          </div>
        )}
        <div className="public-inp-box">
          <p>
            <sup>*</sup>Admin
          </p>
          <input
            className="other-in"
            value={input.admin}
            onChange={(e) => {
              setInput({
                ...input,
                admin: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the admin"
          />
        </div>
        <div className="public-inp-box">
          <p>Website Link(Optional)</p>
          <input
            className="other-in"
            value={input.website_link}
            onChange={(e) => {
              setInput({
                ...input,
                website_link: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the website link"
          />
        </div>
        <div className="public-inp-box">
          <p>Twitter Link(Optional)</p>
          <input
            className="other-in"
            value={input.twitter_link}
            onChange={(e) => {
              setInput({
                ...input,
                twitter_link: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the twitter link"
          />
        </div>
        <div className="public-inp-box">
          <p>Discord Link(Optional)</p>
          <input
            className="other-in"
            value={input.discord_link}
            onChange={(e) => {
              setInput({
                ...input,
                discord_link: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the discord link"
          />
        </div>
        <div className="public-inp-box">
          <p>Telegram Link(Optional)</p>
          <input
            className="other-in"
            value={input.tg_link}
            onChange={(e) => {
              setInput({
                ...input,
                tg_link: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the telegram link"
          />
        </div>
        <div className="public-inp-box">
          <p>Medium Link(Optional)</p>
          <input
            className="other-in"
            value={input.medium_link}
            onChange={(e) => {
              setInput({
                ...input,
                medium_link: e.target.value,
              });
            }}
            type="text"
            placeholder="Please enter the medium"
          />
        </div>
        <div className="public-inp-box">
          <p className="submit-btn">
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={() => {
                input.collection_type === "721"
                  ? createCollectionWith721()
                  : createCollectionWith404();
              }}
            >
              Submit
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
