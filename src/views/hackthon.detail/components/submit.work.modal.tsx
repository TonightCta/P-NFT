import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Base64ToFile, CompressImage, GetUrlKey } from "../../../utils";
import axios from "axios";
import { useHackthon } from "../../../hooks/hackthon";
import { PNft } from "../../../App";
import { MemeAddress, SystemAddress } from "../../../utils/source";
import { web3 } from "../../../utils/types";

interface Input {
  img: {
    view: string;
    source: string | File;
  };
  amount: string | number;
  address: string;
}

const SubmitWorkModal = (props: {
  visible: boolean;
  hackthon_id:number;
  min:string;
  openSuccess:(val:number) => void;
  onClose: (val: boolean) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const { QueryERC20Approve, SubmitHackthon, ApproveToken } = useHackthon();
  const [loading, setLoading] = useState<boolean>(false);
  const { state } = useContext(PNft);
  const [input, setInput] = useState<Input>({
    img: {
      view: "",
      source: "",
    },
    amount: "",
    address: GetUrlKey('referrer', window.location.href) || SystemAddress
  });
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
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
    if (!input.img.source) {
      message.error("Please upload the NFT");
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
    if (!input.address) {
      message.error("Please enter the referrer address");
      return;
    }
    setLoading(true);
    const query = await QueryERC20Approve(state.address as string, MemeAddress);
    const queryNum = +web3.utils.fromWei(String(query), "ether");
    if (queryNum < 1) {
      const approve: any = await ApproveToken(MemeAddress);
      if (!approve || approve.message) {
        setLoading(false);
        return;
      }
      submitWork();
      return;
    }
    const ipfs = await uploadFileFN(`${Date.now()}.png`, input.img.source);
    const { ipfshash } = ipfs;
    const result:any = await SubmitHackthon(props.hackthon_id,ipfshash,+input.amount,input.address);
    setLoading(false);
    if(!result || result.message){
        message.error(result.message);
        return
    };
    message.success('Submit successful');
    setVisible(false);
    props.onClose(false);
    props.openSuccess(props.hackthon_id);
    setInput({
        amount:'',
        img:{
            view:'',
            source:''
        },
        address:SystemAddress
    })
  };
  return (
    <Modal
      title="Submit work"
      open={visible}
      footer={null}
      className="work-modal-custom"
      onCancel={() => {
        props.onClose(false);
        setVisible(false);
      }}
    >
      <div className="work-inner">
        <ul>
          <li>
            <p>NFT</p>
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
          <li>
            <p>Contribution Amount</p>
            <input
              type="number"
              placeholder={`Min ${+props.min / 1e18}`}
              value={input.amount}
              onChange={(e) => {
                setInput({
                    ...input,
                    amount:e.target.value
                })
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
                    address:e.target.value
                })
              }}
            />
          </li>
        </ul>
        <p className="submit" onClick={submitWork}>
          <Button type="primary" loading={loading} disabled={loading}>Submit</Button>
        </p>
      </div>
    </Modal>
  );
};
export default SubmitWorkModal;
