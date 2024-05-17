import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { Base64ToFile, CompressImage } from "../../../utils";

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
  onClose: (val: boolean) => void;
}): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [input, setInput] = useState<Input>({
    img: {
      view: "",
      source: "",
    },
    amount: "",
    address: "",
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
    if(!input.address){
        message.error('Please enter the referrer address');
        return
    };

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
              placeholder="Please enter the contribution amount"
            />
          </li>
          <li>
            <p>Referrer</p>
            <input
              type="text"
              placeholder="Please enter the referrer address"
            />
          </li>
        </ul>
        <p className="submit" onClick={submitWork}>
          <Button type="primary">Submit</Button>
        </p>
      </div>
    </Modal>
  );
};
export default SubmitWorkModal;
