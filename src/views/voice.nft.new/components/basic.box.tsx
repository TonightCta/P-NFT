import { ReactElement, useEffect, useRef, useState } from "react";
import IconFont from "../../../utils/icon";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMediaRecorder } from "../../../hooks/record";
import Recording from "../../voice.nft/components/recording";
import { VERSION } from "../../../utils/source";

const BasicBox = (): ReactElement => {
    const { audioFile, mediaUrl, startRecord, stopRecord } = useMediaRecorder();
    const [audio, setAudio] = useState<string>('');
    const audioRef: any = useRef('');
    const [record, setRecord] = useState<boolean>(false);
    const [review, setReview] = useState<{ source: string | File, view: string }>({
        source: '',
        view: ''
    });
    const selectPic = (e: any) => {
        const file = e.target.files[0];
        setReview({
            source: file,
            view: URL.createObjectURL(file)
        })
    };
    useEffect(() => {
        setAudio(mediaUrl);
        setTimeout(() => {
            mediaUrl && audioRef.current.play()
        }, 100)
    }, [mediaUrl]);
    return (
        <div className="basic-box">
            <div className="up-image-box up-public">
                <p className="up-title">
                    <IconFont type="icon-tupian" />
                    <sup>*</sup>
                    Image or 3D Model
                </p>
                <div className="up-box">
                    {review.source && <div className="review-box">
                        <img src={review.view} alt="" />
                        <div className="delete-box" onClick={() => {
                            setReview({
                                source: '',
                                view: ''
                            })
                        }}>
                            <DeleteOutlined />
                        </div>
                    </div>}
                    <input type="file" accept="image/*" onChange={selectPic} />
                    <div className="load-btn">
                        <img src={require('../../../assets/images/up_file.png')} alt="" />
                    </div>
                    <p>Drag and Drop File or browse media on your device</p>
                    <p>File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB, GLTF. Max size: 100 MB</p>
                </div>
            </div>
            <div className="up-audio-box up-public">
                <p className="up-title">
                    <IconFont type="icon-yinpin" />
                    <sup>*</sup>
                    Audio
                </p>
                <div className="up-box">
                    <div className="load-btn" onClick={() => {
                        setRecord(record ? false : true)
                        !record ? startRecord() : stopRecord()
                    }}>
                        {!record ? <img src={require(`../../../assets/images/record_icon.png`)} alt="" />
                            : <Recording />}
                    </div>
                    <p>Click button to start Recording</p>
                    <audio  ref={audioRef} src={audio} controls />
                </div>
            </div>
            <p className="submit-btn">
                <Button type="primary">Confirm and Mint</Button>
            </p>
        </div>
    )
};

export default BasicBox;