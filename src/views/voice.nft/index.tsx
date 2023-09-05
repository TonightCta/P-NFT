import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import './index.scss'
import { Button, Select, Slider, Spin, Tooltip, message, Image } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useMediaRecorder } from "../../hooks/record";
import { LoadingOutlined } from '@ant-design/icons';
import { useSwitchChain } from "../../hooks/chain";
import { NFTMintService, UploadFileService, QueryFile } from "../../request/api";
import { PNft } from "../../App";
import { useMetamask } from "../../utils/metamask";
import { NFTAddress, useContract } from "../../utils/contract";
import { ethereum } from "../../utils/types";
import axios from "axios";
import type { SliderMarks } from 'antd/es/slider';
import { Model } from "../../utils/source";
import Recording from "./components/recording";
import MaskCard from "../../components/mask";
import MaskElement from "./components/mask.element";

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
    aiText: boolean,
    aiImageText: boolean
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
    const { mint, getBalance } = useContract();
    const [cType, setCType] = useState<number>(0);
    const [rate, setRate] = useState<number>(100);
    const [aiText, setAIText] = useState<string>('');
    const [aiImageText, setAIImageText] = useState<string>('');
    const [modelType, setModelType] = useState<string>('1');
    const [upAiWait, setUpAiWait] = useState<boolean>(false);
    const selectModel = (value: string) => {
        setModelType(value)
    };
    const [imageType, setImageType] = useState<number>(0);
    const [aiImageView, setAiImageView] = useState<{ url: string, minio_key: string, ipfs: string }>({
        url: '',
        minio_key: '',
        ipfs: ''
    });
    const [aiReview, setAIReview] = useState<{ url: string, minio_key: string, ipfs: string }>({
        url: '',
        minio_key: '',
        ipfs: ''
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
        aiText: false,
        aiImageText: false
    });
    const [wait, setWait] = useState<boolean>(false);
    const [imageWait, setImageWait] = useState<boolean>(false);
    const [loadImage, setLoadImage] = useState<boolean>(true);
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
    });
    //Select Voice Or Ai
    const selectFileFN = (e: any) => {
        const file = e.target.files[0];
        setNftFile({
            source: file,
            view: URL.createObjectURL(file)
        })
    };
    //Back Top
    const sc = (_dis?: number) => {
        window.scrollTo({
            top: _dis ? _dis : 0,
            behavior: 'smooth'
        })
    };
    //IPFS Upload
    const uploadFileFN = async (_file_name: string, _file: any) => {
        if (!_file) {
            return
        }
        const formData = new FormData();
        const fileSize = _file.size / (1024 * 1024);
        if (fileSize > 5) {
            message.warning('The maximum file size is 5MB.');
            setWait(false);
            return
        }
        formData.append('file', _file);
        formData.append('name', _file_name);
        const result = await axios.post(`${process.env.REACT_APP_BASEURL_IPFS}/upload-file`, formData);
        return result.data.data;
    };
    //Service Upload
    const uploadFileLocaFN = async (_file: any) => {
        if (!_file) {
            return
        }
        const formData = new FormData()
        formData.append('file', _file);
        const result = await UploadFileService(formData);
        return result.data;
    };
    //AI Transfer Voice
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
            name: result.data.voice_url_minio.minio_key
        });
        setAIReview({
            url: file.data,
            minio_key: result.data.voice_url_minio.minio_key,
            ipfs: result.data.voice_url_ipfs
        })
    };
    //Clear Form
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
    };
    //AI Transfer Image
    const uploadFileImageAi = async () => {
        if (!aiImageText) {
            setError({
                ...error,
                aiImageText: true
            });
            return
        };
        setImageWait(true);
        const result: any = await axios.post(`${process.env.REACT_APP_BASEURL_AI}/text2img`, {
            prompts: aiImageText
        });
        setImageWait(false);
        const { data } = result;
        const { errcode } = data;
        if (errcode !== 0) {
            message.error(data.message);
            return
        };
        setAiImageView({
            url: data.img_url_minio.file_url,
            minio_key: data.img_url_minio.minio_key,
            ipfs: data.img_url_ipfs
        });
    }
    //Mint NFT
    const mintNFTFN = async () => {
        const balance = await getBalance();
        const numberBalance: number = +balance / 1e18;
        if (numberBalance <= 0) {
            message.warning('Your available balance is insufficient.');
            return
        }
        if (!state.address) {
            await connectMetamask();
            return
        }
        await switchC(Number(process.env.REACT_APP_CHAIN))
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
        if (imageType === 0 && !nftFile.source) {
            setError({
                ...error,
                img: true
            });
            sc();
            return
        }
        if (imageType === 1 && !aiImageView.minio_key) {
            setError({
                ...error,
                img: true
            });
            sc();
            return
        }
        // if (cType === 0 && !audioFile) {
        //     setError({
        //         ...error,
        //         audio: true
        //     });
        //     return
        // };
        // if (cType === 1 && !aiReview.minio_key) {
        //     setError({
        //         ...error,
        //         aiText: true
        //     });
        //     return
        // };
        setWait(true);
        const img_ipfs = imageType === 0 ? await uploadFileFN(`${new Date().getTime()}.png`, nftFile.source) : null;
        //img_ipfs.ipfshash
        const voice_ipfs = cType === 0 ? await uploadFileFN(`${new Date().getTime()}.mp3`, audioFile) : null;
        //voice_ipfs.ipfshash
        const img_local = imageType === 0 ? await uploadFileLocaFN(nftFile.source) : null;
        const voice_local = cType === 0 ? await uploadFileLocaFN(audioFile) : null;
        let data: any = {
            name: form.name,
            description: form.desc,
            image: imageType === 0 ? img_ipfs.ipfshash : aiImageView.ipfs,
            external_url: cType === 0 ? voice_ipfs?.ipfshash : aiReview?.ipfs
        }
        if (typeof data === 'object') {
            data = JSON.stringify(data, undefined, 4)
        }
        const blob = new Blob([data], { type: 'text/json' });
        const blob_ipfs = await uploadFileFN(`${new Date().getTime()}.json`, blob);
        const result: any = await mint(blob_ipfs.ipfshash);
        if (!result || result.message) {
            setWait(false);
            return
        }
        const formData = new FormData();
        formData.append('chain_id', process.env.REACT_APP_CHAIN as string);
        formData.append('contract_address', NFTAddress);
        formData.append('contract_type', '721');
        formData.append('sender', ethereum.selectedAddress);
        formData.append('tx_hash', result['transactionHash']);
        formData.append('image_minio', imageType === 0 ? img_local.minio_key : aiImageView.minio_key);
        formData.append('voice_minio', cType === 0 ? voice_local?.minio_key : aiReview?.minio_key);
        formData.append('meta_data_ipfs', blob_ipfs.ipfshash);
        formData.append('image_ipfs', imageType === 0 ? img_ipfs.ipfshash : aiImageView.ipfs);
        formData.append('voice_ipfs', cType === 0 ? voice_ipfs?.ipfshash : aiReview?.ipfs);
        formData.append('name', form.name);
        formData.append('description', form.desc);
        const mintResult = await NFTMintService(formData);
        const { status } = mintResult;
        if (status !== 200) {
            message.error(mintResult.msg);
            return
        }
        message.success('Mint Successfully!');
        clearForm();
        setWait(false);
    }
    return (
        <div className="voice-nft-view">
            <MaskElement />
            <div className="build-inner">
                <MaskCard />
                <div className="up-mask">
                    {/* Name */}
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
                    {/* Desc */}
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
                    {/* Image */}
                    <div className="inp-public">
                        <p className="inp-label"><sup>*</sup>Image or 3D Model
                            <Tooltip placement="top" title="unknow">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </p>
                        <div className={`upload-file ${error.img ? 'filed-b' : ''}`}>
                            <div className="image-tabs public-tabs">
                                <ul>
                                    {
                                        ['Image', 'AI'].map((item: string, index: number) => {
                                            return (
                                                <li key={index} className={`${imageType === index ? 'active-ctype' : ''}`} onClick={() => {
                                                    setImageType(index)
                                                }}>{item}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            {imageType === 0
                                ? <div>
                                    {!nftFile.view
                                        ? <div className="up-btn">
                                            <p className="up-icon">
                                                <img src={require('../../assets/images/up_file.png')} alt="" />
                                            </p>
                                            <p className="remark-1">Drag and Drop File or browse media on your device</p>
                                            <p className="remark-2"><span>File types supported:</span> JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB, GLTF. <span>Max size:</span> 100 MB</p>
                                            <input type="file" className="upfile-inp" title="Select file" onFocus={() => {
                                                setError({
                                                    ...error,
                                                    img: false
                                                });
                                            }} accept="image/*" onChange={selectFileFN} />
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
                                : <div className="ai-transfer-image">
                                    <div className="text-inp">
                                        <p><sup>*</sup>Prompts</p>
                                        <input value={aiImageText} onChange={(e) => {
                                            setAIImageText(e.target.value)
                                        }} onFocus={() => {
                                            setError({
                                                ...error,
                                                aiImageText: false
                                            })
                                        }} type="text" className={`${error.aiImageText ? 'filed-b' : ''}`} placeholder="Please enter text" />
                                    </div>
                                    {<div className="review-ai-image">
                                        <p>Review</p>
                                        <div className="img-box">
                                            {
                                                aiImageView.ipfs && loadImage && <div className="wait-load">
                                                    <Spin />
                                                </div>
                                            }
                                            {
                                                !aiImageView.ipfs
                                                    ? <p>Please make</p>
                                                    : <Image
                                                        width={200}
                                                        onLoad={() => {
                                                            setLoadImage(false)
                                                        }}
                                                        src={aiImageView.url}
                                                    />
                                            }
                                        </div>
                                    </div>}
                                    <p className="save-btn">
                                        <Button type="primary" disabled={imageWait} loading={imageWait} onClick={uploadFileImageAi}>Generate Image</Button>
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                    {/* Voice */}
                    <div className="inp-public">
                        <p className="inp-label">Audio
                            <Tooltip placement="top" title="unknow">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </p>
                        <div className={`upload-record ${error.audio ? 'filed-b' : ''}`}>
                            <div className="record-tabs public-tabs">
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
                                            {!record ? <img src={require('../../assets/images/record_icon.png')} alt="" />
                                                : <Recording />}
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
                                                Generate Voice
                                            </Button>
                                        </p>
                                    </div>
                            }
                        </div>
                    </div>
                    {/* NFT Type */}
                    <div className="inp-public">
                        <p className="inp-label"><sup>*</sup>NFT Type
                            <Tooltip placement="top" title="unknow">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </p>
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
            {/* <Button onClick={() => {
                balanceErc20('0x6302744962a0578E814c675B40909e64D9966B0d');
            }}>Test Query</Button> */}
        </div>
    )
};

export default VoiceNFTView;