import { DownOutlined } from "@ant-design/icons";
import { Button, Modal, Popover } from "antd";
import { ReactElement, useEffect, useState } from "react";

interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
    sell?:boolean
}

const FixedModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    const [token, setToken] = useState<string>('USDT')
    const content = (
        <div className="token-list">
            {
                ['USDT', 'PI', 'BNB'].map((item: string, index: number) => {
                    return (
                        <p className={`${item === token ? 'active-token' : ''}`} key={index} onClick={() => {
                            setToken(item)
                        }}>{item}</p>
                    )
                })
            }
        </div>
    );
    useEffect(() => {
        setVisible(props.visible)
    }, [props.visible])
    return (
        <Modal open={visible} width={480} maskClosable onCancel={() => {
            setVisible(false);
            props.closeModal(false);
        }} title={props.sell ? 'Sell Your NFT' : 'Change Price'} footer={null}>
            <div className="fixed-price-inner">
                {
                    props.sell && <div className="sell-nft">
                        <div className="nft-box">
                            <img src={require('../../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </div>
                        <p className="nft-name">BabyBunny</p>
                        <p className="token-id">XXXX #0001</p>
                    </div>
                }
                <p className="label">Price</p>
                <div className="inp-and-coin">
                    <input type="number" placeholder="0.0" onWheel={(e: any) => e.target?.blur()} />
                    <Popover content={content} title={null} placement="bottom">
                        <div className="coin-select">
                            <p>{token}</p>
                            <DownOutlined />
                        </div>
                    </Popover>
                </div>
                <p className="remark">List your NFT to sell for 0.0 BTC</p>
                <p className="submit-btn">
                    <Button>{props.sell ? 'Start listing' : 'Update'}</Button>
                </p>
            </div>
        </Modal>
    )
};

export default FixedModal;