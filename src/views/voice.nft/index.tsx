import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import './index.scss'
import { Button, Select, Slider, Spin, message } from "antd";
import { AudioMutedOutlined, AudioOutlined, DeleteOutlined, FileImageOutlined } from "@ant-design/icons";
import { useMediaRecorder } from "../../hooks/record";
import { LoadingOutlined } from '@ant-design/icons';
import { useSwitchChain } from "../../hooks/chain";
import { NFTMintService, UploadFileService,QueryFile } from "../../request/api";
import { PNft } from "../../App";
import { useMetamask } from "../../utils/metamask";
import { useContract } from "../../utils/contract";
import { ethereum } from "../../utils/types";
import axios from "axios";
import type { SliderMarks } from 'antd/es/slider';
import { Model } from "../../utils/source";

const marks: SliderMarks = {
    100: 'Slow',
    200: 'Fast',
};

interface File {
    source: File | null,
    view: string
}
interface Error {
    name: boolean,
    desc: boolean,
    img: boolean,
    audio: boolean,
    aiText: boolean
}

interface Form {
    name: string,
    desc: string,
}
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const VoiceNFTView = (): ReactElement<ReactNode> => {
    const { state } = useContext(PNft)
    const { audioFile, mediaUrl, startRecord, stopRecord } = useMediaRecorder();
    const [record, setRecord] = useState<boolean>(false);
    const [audio, setAudio] = useState<string>('');
    const { connectMetamask } = useMetamask();
    const audioRef: any = useRef('');
    const { switchC } = useSwitchChain();
    const { mint } = useContract();
    const [cType, setCType] = useState<number>(0);
    const [rate, setRate] = useState<number>(100);
    const [aiText, setAIText] = useState<string>('');
    const [modelType, setModelType] = useState<string>('1');
    const [upAiWait,setUpAiWait] = useState<boolean>(false);
    const selectModel = (value: string) => {
        setModelType(value)
    };
    const [aiReview,setAIReview] = useState<{url:string,minio_key:string,ipfs:''}>({
        url:'',
        minio_key:'',
        ipfs:''
    });
    const [nftFile, setNftFile] = useState<File>({
        source: null,
        view: ''
    });
    const [error, setError] = useState<Error>({
        name: false,
        desc: false,
        img: false,
        audio: false,
        aiText: false
    });
    const [wait, setWait] = useState<boolean>(false);
    // const []
    useEffect(() => {
        setAudio(mediaUrl);
        mediaUrl && setError({
            ...error,
            audio: false
        });
        setTimeout(() => {
            mediaUrl && audioRef.current.play()
        }, 100)
    }, [mediaUrl]);
    const [form, setForm] = useState<Form>({
        name: '',
        desc: ''
    })
    const selectFileFN = (e: any) => {
        const file = e.target.files[0];
        setNftFile({
            source: file,
            view: URL.createObjectURL(file)
        })
    };
    const sc = (_dis?: number) => {
        window.scrollTo({
            top: _dis ? _dis : 0,
            behavior: 'smooth'
        })
    };
    const uploadFileFN = async (_file_name: string, _file: any) => {
        const formData = new FormData()
        formData.append('file', _file);
        formData.append('name', _file_name);
        const result = await axios.post(`${process.env.REACT_APP_BASEURL_IPFS}/upload-file`, formData);
        return result.data.data;
    };
    const uploadFileLocaFN = async (_file: any) => {
        const formData = new FormData()
        formData.append('file', _file);
        const result = await UploadFileService(formData);
        return result.data;
    };
    const uploadFileAi = async () => {
        if (!aiText) {
            setError({
                ...error,
                aiText: true
            });
            return
        };
        setUpAiWait(true);
        const params = {
            text: aiText,
            rate: rate,
            model: +modelType
        };
        const result = await axios.post(`${process.env.REACT_APP_BASEURL_AI}/text2voice`, params);
        setUpAiWait(false);
        const file = await QueryFile({
            name:result.data.voice_url_minio.minio_key
        });
        setAIReview({
            url:file.data,
            minio_key:result.data.voice_url_minio.minio_key,
            ipfs:result.data.voice_url_ipfs
        })
    }
    const clearForm = () => {
        setForm({
            name: '',
            desc: ''
        });
        setNftFile({
            source: null,
            view: ''
        });
        setAudio('');
    }
    const mintNFTFN = async () => {
        if (!state.address) {
            await connectMetamask();
            return
        }
        await switchC(8007736)
        if (!form.name) {
            setError({
                ...error,
                name: true
            });
            sc();
            return;
        }
        if (!form.desc) {
            setError({
                ...error,
                desc: true
            });
            sc();
            return;
        }
        if (!nftFile.source) {
            setError({
                ...error,
                img: true
            });
            sc();
            return
        }
        if (cType === 0 && !audioFile) {
            setError({
                ...error,
                audio: true
            });
            return
        };
        if (!aiReview.minio_key) {
            setError({
                ...error,
                aiText: true
            });
            return
        };
        setWait(true);
        const img_ipfs = await uploadFileFN(`${new Date().getTime()}.png`, nftFile.source);
        //img_ipfs.ipfshash
        const voice_ipfs = cType === 0 ? await uploadFileFN(`${new Date().getTime()}.mp3`, audioFile) : null;
        //voice_ipfs.ipfshash
        const img_local = await uploadFileLocaFN(nftFile.source);
        const voice_local = cType === 0 ? await uploadFileLocaFN(audioFile) : null;
        let data: any = {
            name: form.name,
            description: form.desc,
            image: img_ipfs.ipfshash,
            external_url:  cType === 0 ? voice_ipfs.ipfshash : aiReview.ipfs
        }
        if (typeof data === 'object') {
            data = JSON.stringify(data, undefined, 4)
        }
        const blob = new Blob([data], { type: 'text/json' });
        const blob_ipfs = await uploadFileFN(`${new Date().getTime()}.json`, blob);
        const result: any = await mint(blob_ipfs.ipfshash);
        const formData = new FormData();
        formData.append('chain_id', '8007736');
        formData.append('contract_address', '0x1a0eCc31DACcA48AA877db575FcBc22e1FEE671b');
        formData.append('contract_type', '721');
        formData.append('sender', ethereum.selectedAddress);
        formData.append('tx_hash', result['transactionHash']);
        formData.append('imgage_minio', img_local.minio_key);
        formData.append('voice_minio', cType === 0 ? voice_local.minio_key : aiReview.minio_key);
        formData.append('meta_data_ipfs', blob_ipfs.ipfshash);
        formData.append('image_ipfs', img_ipfs.ipfshash);
        formData.append('voice_ipfs', cType === 0 ? voice_ipfs.ipfshash : aiReview.ipfs);
        formData.append('name', form.name);
        formData.append('description', form.desc);
        const mintResult = await NFTMintService(formData);
        console.log(mintResult);
        message.success('Mint Successful!');
        clearForm();
        setWait(false);
    }
    return (
        <div className="voice-nft-view">
            <div className="build-inner">
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>Name</p>
                    <p>
                        <input type="text" placeholder="Voice NFT Name" value={form.name} onChange={(e) => {
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }} onFocus={() => {
                            setError({
                                ...error,
                                name: false
                            })
                        }} className={`${error.name ? 'filed-b' : ''}`} />
                    </p>
                </div>
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>Describtion(Optional)</p>
                    <p>
                        <textarea name="" id="" placeholder="Describe your Voice NFT" value={form.desc} onChange={(e) => {
                            setForm({
                                ...form,
                                desc: e.target.value
                            })
                        }} onFocus={() => {
                            setError({
                                ...error,
                                desc: false
                            })
                        }} className={`${error.desc ? 'filed-b' : ''}`}></textarea>
                    </p>
                </div>
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>Image or 3D Model</p>
                    <div className={`upload-file ${error.img ? 'filed-b' : ''}`}>
                        {!nftFile.view
                            ? <div className="up-btn">
                                <p>File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,</p>
                                <p> OGG, GLB, GLTF. Max size: 100 MB</p>
                                <p className="up-icon">
                                    <FileImageOutlined />
                                </p>
                                <input type="file" title="Select file" onFocus={() => {
                                    setError({
                                        ...error,
                                        img: false
                                    });
                                }} accept="image/*" onChange={selectFileFN} />
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
                    <div className={`upload-record ${error.audio ? 'filed-b' : ''}`}>
                        <div className="record-tabs">
                            <ul>
                                {
                                    ['Voice', 'Ai'].map((item: string, index: number): ReactNode => {
                                        return (
                                            <li key={index} className={`${cType === index ? 'active-ctype' : ''}`} onClick={() => {
                                                setCType(index)
                                            }}>{item}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        {
                            cType === 0
                                ? <div>
                                    <div className="record-start" onClick={() => {
                                        setRecord(record ? false : true)
                                        !record ? startRecord() : stopRecord()
                                    }}>
                                        {!record ? <AudioOutlined />
                                            : <AudioMutedOutlined />}
                                    </div>
                                    <audio ref={audioRef} src={audio} controls></audio>
                                </div>
                                : <div className="ai-build">
                                    <div className="build-public">
                                        <p className="build-title"><sup>*</sup>Text</p>
                                        <div className={`build-inp`}>
                                            <textarea className={`${error.aiText ? 'filed-b' : ''}`} name="" id="" placeholder="Please enter the text" value={aiText} onChange={(e) => {
                                                setAIText(e.target.value)
                                            }}></textarea>
                                        </div>
                                    </div>
                                    <div className="build-public">
                                        <p className="build-title"><sup>*</sup>Speed</p>
                                        <div className="build-inp">
                                            <Slider marks={marks} min={100} max={200} onChange={(value) => {
                                                setRate(value);
                                            }} />
                                        </div>
                                    </div>
                                    <div className="build-public">
                                        <p className="build-title"><sup>*</sup>Model</p>
                                        <div className="build-inp">
                                            <Select
                                                defaultValue="1"
                                                style={{ width: 120 }}
                                                onChange={selectModel}
                                                options={Model}
                                            />
                                        </div>
                                    </div>
                                    {aiReview.url && <div className="ai-review">
                                        <p>Review</p>
                                        <audio src={aiReview.url} controls></audio>
                                    </div>}
                                    <p className="save-btn">
                                        <Button type="primary" loading={upAiWait} disabled={upAiWait} onClick={() => {
                                            uploadFileAi()
                                        }}>
                                            Save
                                        </Button>
                                    </p>
                                </div>
                        }
                    </div>
                </div>
                <div className="inp-public">
                    <p className="inp-label"><sup>*</sup>NFT Type</p>
                    <Select
                        defaultValue="721"
                        style={{ width: '100%', height: '46px' }}
                        options={[
                            { value: '721', label: 'ERC721' },
                        ]}
                    />
                </div>
                <p className="submit-btn">
                    <Button type="primary" size="large" onClick={mintNFTFN} disabled={wait}>
                        {!wait
                            ? <span>Confirm and Mint</span>
                            : <Spin indicator={antIcon} size="small" />}
                    </Button>
                </p>
            </div>
        </div>
    )
};

export default VoiceNFTView;