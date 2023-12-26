import { Modal } from "antd";
import { ReactElement, useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Base64ToFile } from "../../../utils";

interface Props {
    visible: boolean,
    image: string,
    closeModal: (val: boolean) => void,
    uploadFile: (val: File) => void
}

const CropperModal = (props: Props): ReactElement => {
    const cropperRef: any = useRef<ReactCropperElement>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [image, setImage] = useState<string>('');
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    useEffect(() => {
        props.visible && setVisible(props.visible);
        props.image && setImage(props.image);
    }, [props.visible]);
    const close = () => {
        setVisible(false);
        props.closeModal(false);
    }
    return (
        <Modal open={visible} title={null} confirmLoading={confirmLoading} className="cropper-modal-mine" onOk={() => {
            setConfirmLoading(true);
            const cropper = cropperRef.current?.cropper;
            props.uploadFile(Base64ToFile(cropper.getCroppedCanvas().toDataURL()));
            setTimeout(() => {
                close();
                setConfirmLoading(false);
            }, 1000);
        }} onCancel={close}>
            <Cropper
                ref={cropperRef}
                src={image}
                dragMode='none'
                responsive={true}
                checkOrientation={false}
                autoCropArea={1}
                style={{ height: 420, width: '100%' }}
                aspectRatio={1 / 1}
            />
        </Modal>
    )
};

export default CropperModal;