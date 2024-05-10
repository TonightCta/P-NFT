import { ReactElement, useContext, useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import { Info } from "..";
import { useContract } from "../../../utils/contract";
import { PNft } from "../../../App";
import { web3 } from "../../../utils/types";

interface Props extends Info {
  price: number;
  visible: boolean;
  onClose: (val: boolean) => void;
  uploadData: () => void;
}

const MintModal = (props: Props): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | string>("");
  const { state } = useContext(PNft);
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(state.address || '');
  const [limit, setLimit] = useState<string>("");
  const { QueryNFTLimit, MintCollection } = useContract();
  const queryLimit = async () => {
    const result = await QueryNFTLimit(props.contract_address);
    setLimit(result);
  };
  const buyCollection = async () => {
    if(!address){
        message.error('Please enter the address');
        return
    }
    if(!web3.utils.isAddress(address)){
        message.error('Please enter the correct encryption address');
        return
    }
    if (!amount) {
      message.error("Please enter the purchase share");
      return;
    }
    if (+amount < 1) {
      message.error("The minimum purchase share is 1");
      return;
    }
    setLoading(true);
    const result: any = await MintCollection(
      props.contract_address,
      +amount,
      +amount * props.price,
      address
    );
    setLoading(false);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success("Purchase successful");
    setVisible(false);
    props.onClose(false);
    props.uploadData();
    setAmount("");
  };
  useEffect(() => {
    props.contract_address && queryLimit();
  }, [props.contract_address]);
  useEffect(() => {
    props.visible && setVisible(props.visible);
  }, [props.visible]);
  return (
    <div className="mint-modal">
      <Modal
        title="Mint"
        className="mint-collection-modal"
        footer={null}
        open={visible}
        width={560}
        onCancel={() => {
          setVisible(false);
          props.onClose(false);
        }}
      >
        <div className="collection-modal-inner">
          <div className="col-msg">
            <div className="logo-items">
              <div className="logo-box">
                <img src={props.poster_url} alt="" />
              </div>
              <div className="items-msg">
                <p>{props.collection_name}</p>
                <p>{props.total_supply} NFTs</p>
              </div>
            </div>
            <div className="mint-msg">
              <p>Mint Prices:</p>
              <p>
                {props.price}&nbsp;{props.pay_token_name}
              </p>
            </div>
          </div>
          <div className="mint-num">
            <input type="text" placeholder="Address" value={address} onChange={(e) => {
                setAddress(e.target.value)
            }}/>
          </div>
          <div className="mint-num">
            <input
              type="number"
              onWheel={(event) => (event.target as HTMLElement).blur()}
              placeholder={`${props.current_supply}/${props.total_supply}(Max:${limit})`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            <p
              onClick={() => {
                setAmount(+limit);
              }}
            >
              MAX
            </p>
          </div>
          <div className="submit-btn">
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={() => {
                buyCollection();
              }}
            >
              Mint
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MintModal;
