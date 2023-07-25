import { Modal } from "antd";
import { ReactElement, useState } from "react";

const ConnectModal = () : ReactElement => {
    const [visible,setVisible] = useState<boolean>(false);
    return (
        <Modal title="Connect Twitter" open={visible} footer={null} maskClosable={false} keyboard={false}>
            13
        </Modal>
    )
};

export default ConnectModal;