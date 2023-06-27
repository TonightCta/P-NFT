import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import './index.scss'
import { Button, Select } from "antd";
import { AudioMutedOutlined, AudioOutlined, DeleteOutlined, FileImageOutlined } from "@ant-design/icons";
import useMediaRecorder from "../../hooks/record";

interface File {
    source: File | null,
    view: string
}

const VoiceNFTView = (): ReactElement<ReactNode> => {
    const { mediaUrl, startRecord, stopRecord } = useMediaRecorder();
    const [record, setRecord] = useState<boolean>(false);
    const [audio, setAudio] = useState<string>('');
    const audioRef: any = useRef('');
    const [nftFile, setNftFile] = useState<File>({
        source: null,
        view: ''
    });
    // const []
    useEffect(() => {
        console.log(mediaUrl)
        setAudio(mediaUrl)
        setTimeout(() => {
            mediaUrl && audioRef.current.play()
        }, 100)
    }, [mediaUrl]);
    const selectFileFN = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
            setNftFile({
                source: file,
                view: e.target.result
            })
        }
    }
    return (
        <div className="voice-nft-view">
            <div className="build-inner">
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>Name</p>
                    <p>
                        <input type="text" placeholder="Voice NFT Name" />
                    </p>
                </div>
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>Describtion(Optional)</p>
                    <p>
                        <textarea name="" id="" placeholder="Describe your Voice NFT"></textarea>
                    </p>
                </div>
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>Image or 3D Model</p>
                    <div className="upload-file">
                        {!nftFile.view
                            ? <div className="up-btn">
                                <p>File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,</p>
                                <p> OGG, GLB, GLTF. Max size: 100 MB</p>
                                <p className="up-icon">
                                    <FileImageOutlined />
                                </p>
                                <input type="file" title="Select file" accept="image/*" onChange={selectFileFN} />
                                <p>Drag and Drop File </p>
                                <p> or browse media on your device</p>
                            </div>
                            : <div className="review">
                                <div className="delete-file" onClick={() => {
                                    setNftFile({
                                        source: null,
                                        view: ''
                                    })
                                }}>
                                    <DeleteOutlined />
                                </div>
                                <img src={nftFile.view} alt="" />
                            </div>}
                    </div>
                </div>
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>Audio</p>
                    <div className="upload-record">
                        <div className="record-start" onClick={() => {
                            setRecord(record ? false : true)
                            !record ? startRecord() : stopRecord()
                        }}>
                            {!record ? <AudioOutlined />
                                : <AudioMutedOutlined />}
                        </div>
                        <audio ref={audioRef} src={audio} controls></audio>
                    </div>
                </div>
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>NFT Type</p>
                    <Select
                        defaultValue="lucy"
                        style={{ width: '100%', height: '46px' }}
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' },
                            { value: 'Yiminghe', label: 'yiminghe' },
                            { value: 'disabled', label: 'Disabled', disabled: true },
                        ]}
                    />
                </div>
                <p className="submit-btn">
                    <Button type="primary" size="large">Confirm and Mint</Button>
                </p>
            </div>
        </div>
    )
};

export default VoiceNFTView;