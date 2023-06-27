import { ReactElement, useEffect, useState } from "react";
import { Button, Modal } from "antd";

interface Props {
    visible: boolean,
    closeModal: (val: boolean) => void,
}


const VerifyModal = (props: Props): ReactElement => {
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        setVisible(props.visible)
    }, [props.visible])
    return (
        <Modal open={visible} width={480} maskClosable onCancel={() => {
            setVisible(false);
            props.closeModal(false);
        }} title="Verify address" footer={null}>
            <div className="verify-modal-inner">
                <p className="verify-remark">
                    You will be asked to sign a message so that
                    we can verify you as the owner of the
                    address.
                </p>
                <p>
                    <Button type="primary">OK</Button>
                    <Button type="default" onClick={() => {
                        setVisible(false);
                        props.closeModal(false);
                    }}>Cancel</Button>
                </p>
            </div>
        </Modal>
    )
};

export default VerifyModal;