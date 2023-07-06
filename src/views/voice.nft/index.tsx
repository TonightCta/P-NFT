import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import './index.scss'
import { Button, Select, Spin, message } from "antd";
import { AudioMutedOutlined, AudioOutlined, DeleteOutlined, FileImageOutlined } from "@ant-design/icons";
import { useMediaRecorder } from "../../hooks/record";
import { LoadingOutlined } from '@ant-design/icons';
import { useSwitchChain } from "../../hooks/chain";
import { NFTMintService } from "../../request/api";
import { PNft } from "../../App";
import { useMetamask } from "../../utils/metamask";
import { useContract } from "../../utils/contract";
import { ethereum } from "../../utils/types";
import axios from "axios";

interface File {
    source: File | null,
    view: string
}
interface Error {
    name: boolean,
    desc: boolean,
    img: boolean,
    audio: boolean
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
    const [nftFile, setNftFile] = useState<File>({
        source: null,
        view: ''
    });
    const [error, setError] = useState<Error>({
        name: false,
        desc: false,
        img: false,
        audio: false
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
        if (!audioFile) {
            setError({
                ...error,
                audio: true
            });
            return
        };
        setWait(true);
        const img_ipfs = await uploadFileFN(`${new Date().getTime()}.png`, nftFile.source);
        //img_ipfs.ipfshash
        const voice_ipfs = await uploadFileFN(`${new Date().getTime()}.mp3`, audioFile);
        //voice_ipfs.ipfshash
        let data: any = {
            name: form.name,
            description: form.desc,
            image: img_ipfs.ipfshash,
            external_url: voice_ipfs.ipfshash
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
        formData.append('image', nftFile.source as any);
        formData.append('voice', audioFile);
        formData.append('meta_data_ipfs', blob_ipfs.ipfshash);
        formData.append('image_ipfs', img_ipfs.ipfshash);
        formData.append('voice_ipfs', voice_ipfs.ipfshash);
        formData.append('name', form.name);
        formData.append('description', form.desc);
        const mintResult = await NFTMintService(formData);
        console.log(mintResult);
        message.success('Mint Successful');
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