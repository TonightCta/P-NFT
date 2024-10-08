import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import IconFont from "../../../utils/icon";
import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMediaRecorder } from "../../../hooks/record";
import Recording from "../../voice.nft/components/recording";
import { Input } from "..";
import axios from "axios";
import { LAND, MODE, useContract } from "../../../utils/contract";
import { NFTMintService, UploadFileService } from "../../../request/api";
import { PNft } from "../../../App";
import { useMetamask } from "../../../utils/connect/metamask";
import { useSwitchChain } from "../../../hooks/chain";
import { useNavigate } from "react-router-dom";
import * as Address from "../../../utils/source";
import { Base64ToFile, CompressImage, FilterAddress } from "../../../utils";
import CropperModal from "./cropper.modal";
import { MintV2ContractAddress } from "../../../utils/source";

const BasicBox = (props: { info: Input }): ReactElement => {
  const { audioFile, mediaUrl, startRecord, stopRecord } = useMediaRecorder();
  const [audio, setAudio] = useState<string>("");
  const [wait, setWait] = useState<boolean>(false);
  const audioRef: any = useRef("");
  const { connectMetamask } = useMetamask();
  const { mint, getBalance, tokenMint, queryERC20Approve, approveToken } =
    useContract();
  const [record, setRecord] = useState<boolean>(false);
  const { state } = useContext(PNft);
  const { switchC } = useSwitchChain();
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [review, setReview] = useState<{ source: string | File; view: string }>(
    {
      source: "",
      view: "",
    }
  );
  const selectPic = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setReview({
        source: file,
        view: URL.createObjectURL(file),
      });
    });
    // if (file) {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         setImage(reader.result as any);
    //     };
    //     reader.readAsDataURL(file);
    // }
  };
  useEffect(() => {
    image && setVisible(true);
  }, [image]);
  useEffect(() => {
    setAudio(mediaUrl);
    setTimeout(() => {
      mediaUrl && audioRef.current.play();
    }, 100);
  }, [mediaUrl]);
  const uploadFileFN = async (_file_name: string, _file: any) => {
    if (!_file) {
      return;
    }
    const formData = new FormData();
    const fileSize = _file.size / (1024 * 1024);
    if (fileSize > 5) {
      message.warning("The maximum file size is 5MB.");
      setWait(false);
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
  const uploadFileLocaFN = async (_file: any) => {
    if (!_file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", _file);
    const result = await UploadFileService(formData);
    return result.data;
  };
  const submitMint = async () => {
    const switc: any = await switchC(+props.info.chain);
    console.log(switc);
    if (switc?.code) return;
    const balance = await getBalance();
    const numberBalance: number = Number(BigInt(balance)) / 1e18;
    if (numberBalance <= 0) {
      message.warning("Your available balance is insufficient.");
      return;
    }
    if (!state.address) {
      await connectMetamask();
      return;
    }
    if (!props.info.name) {
      message.error("Please enter the name");
      return;
    }
    if (props.info.labels.length < 1) {
      message.error("Please select at least one NFT Label");
      return;
    }
    if (!review.source) {
      message.error("Please upload NFT file");
      return;
    }
    setWait(true);
    const pay_address =
      props.info.token_info.address.slice(
        props.info.token_info.address.length - 8,
        props.info.token_info.address.length
      ) === "00000000";
    if (!pay_address) {
      const approve_amount = await queryERC20Approve(
        state.address as string,
        MintV2ContractAddress,
        props.info.token_info.address
      );
      if (+approve_amount / 1e18 < 1) {
        const approve: any = await approveToken(
          props.info.token_info.address,
          MintV2ContractAddress
        );
        if (!approve || approve.message) {
          setWait(false);
          return;
        }
        submitMint();
        return; 
      }
    }
    const img_ipfs = await uploadFileFN(
      `${new Date().getTime()}.png`,
      review.source
    );
    const voice_ipfs =
      audioFile &&
      (await uploadFileFN(`${new Date().getTime()}.mp3`, audioFile));
    const img_local = await uploadFileLocaFN(review.source);
    const voice_local = audioFile && (await uploadFileLocaFN(audioFile));
    let data: any = {
      name: props.info.name,
      description: props.info.desc,
      image: img_ipfs.ipfshash,
      external_url: audioFile ? voice_ipfs.ipfshash : "",
    };
    if (typeof data === "object") {
      data = JSON.stringify(data, undefined, 4);
    }
    const blob = new Blob([data], { type: "text/json" });
    const blob_ipfs = await uploadFileFN(`${new Date().getTime()}.json`, blob);
    const result: any =
      props.info.chain === "8007736"
        ? await tokenMint(blob_ipfs.ipfshash, props.info.token_info.address)
        : await mint(blob_ipfs.ipfshash);
    if (!result || result.message) {
      setWait(false);
      return;
    }
    const formData = new FormData();
    formData.append("chain_id", props.info.chain);
    const NFTAddress =
      LAND === "taiko"
        ? MODE === "taikomain"
          ? Address.TaikoContractAddress721Main
          : Address.TaikoContractAddress721Test
        : MODE === "production"
        ? FilterAddress(state.chain as string).contract_721
        : FilterAddress(state.chain as string).contract_721_test;
    formData.append(
      "contract_address",
      props.info.chain === "8007736" ? MintV2ContractAddress : NFTAddress
    );
    formData.append("contract_type", "721");
    formData.append("sender", state.address as string);
    formData.append("tx_hash", result["transactionHash"]);
    formData.append("image_file_name", img_local.file_name);
    formData.append("voice_file_name", audioFile ? voice_local.file_name : "");
    formData.append("meta_data_ipfs", blob_ipfs.ipfshash);
    formData.append("image_ipfs", img_ipfs.ipfshash);
    formData.append("voice_ipfs", audioFile ? voice_ipfs.ipfshash : "");
    formData.append("name", props.info.name);
    formData.append("description", props.info.desc);
    formData.append("category_id", props.info.category as any);
    formData.append("labels", props.info.labels as any);
    const mintResult = await NFTMintService(formData);
    const { status } = mintResult;
    if (status !== 200) {
      message.error(mintResult.msg);
      return;
    }
    message.success("Mint Successfully!");
    setWait(false);
    navigate(`/user/${state.address}`);
  };
  return (
    <div className="basic-box">
      <div className="up-image-box up-public">
        <p className="up-title">
          <IconFont type="icon-tupian" />
          <sup>*</sup>
          Image or 3D Model
        </p>
        <div className="up-box">
          {review.source && (
            <div className="review-box">
              <img src={review.view} alt="" />
              <div
                className="delete-box"
                onClick={() => {
                  setReview({
                    source: "",
                    view: "",
                  });
                }}
              >
                <DeleteOutlined />
              </div>
            </div>
          )}
          {!review.source && (
            <>
              <input type="file" accept="image/*" onChange={selectPic} />
              <div className="load-btn">
                <img
                  src={require("../../../assets/images/up_file.png")}
                  alt=""
                />
              </div>
              <p>Drag and Drop File or browse media on your device</p>
              <p>
                File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB,
                GLTF. Max size: 100 MB
              </p>
            </>
          )}
        </div>
      </div>
      <div className="up-audio-box up-public">
        <p className="up-title">
          <IconFont type="icon-yinpin" />
          Audio
        </p>
        <div className="up-box">
          <div
            className="load-btn"
            onClick={() => {
              setRecord(record ? false : true);
              !record ? startRecord() : stopRecord();
            }}
          >
            {!record ? (
              <img
                src={require(`../../../assets/images/record_icon.png`)}
                alt=""
              />
            ) : (
              <Recording />
            )}
          </div>
          <p>Click button to start Recording</p>
          <audio ref={audioRef} src={audio} controls />
        </div>
      </div>
      <p className="submit-btn">
        <Button
          type="primary"
          loading={wait}
          disabled={wait}
          onClick={submitMint}
        >
          Confirm and Mint
        </Button>
      </p>
      <CropperModal
        uploadFile={(val: File) => {
          setImage("");
          CompressImage(val, 40, (compressBase64) => {
            const file = Base64ToFile(compressBase64);
            setReview({
              source: file,
              view: URL.createObjectURL(file),
            });
          });
        }}
        visible={visible}
        image={image}
        closeModal={(val: boolean) => {
          setVisible(val);
        }}
      />
    </div>
  );
};

export default BasicBox;
