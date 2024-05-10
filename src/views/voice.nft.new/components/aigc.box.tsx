import { ReactElement, useContext, useState } from "react";
import IconFont from "../../../utils/icon";
import { Button, Select, Slider, message, Image } from "antd";
import type { SliderMarks } from 'antd/es/slider';
import { Input } from "..";
import axios from "axios";
import { MintV2ContractAddress, Model } from "../../../utils/source";
import { NFTMintService, QueryFile } from "../../../request/api";
import { useMetamask } from "../../../utils/connect/metamask";
import { LAND, MODE, useContract } from "../../../utils/contract";
import { useSwitchChain } from "../../../hooks/chain";
import * as Address from '../../../utils/source'
import { PNft } from "../../../App";
import { useNavigate } from "react-router-dom";
import { FilterAddress } from "../../../utils";

interface Coll {
  title: string,
  list: string[]
}

interface Word {
  title: string,
  coll: Coll[]
}

const marks: SliderMarks = {
  100: 'Slow',
  200: 'Fast',
};
const WordList: Word[] = [
  {
    title: 'Style',
    coll: [
      {
        title: 'Style',
        list: ['Renaissance', 'Fauvism', 'Cubism', 'Abstract Art', 'Surrealism', 'OP Art /Optical Art', 'Victorian', 'Futuristic', 'Minimalist', 'Brutalist', 'Miyazaki Hayao style']
      },
    ],
  },
  {
    title: 'Scenes',
    coll: [
      {
        title: 'Scenes',
        list: ['Dystopia,Anti-utopia', 'Fantasy', 'Galaxy', 'Whimsically', 'Universe I Cosmos', 'Forest', 'Ruins', 'City', 'Deserted city buildings', 'Near future city']
      },
    ],
  },
  {
    title: 'Elements',
    coll: [
      {
        title: 'Elements',
        list: ['Robot', 'Elf', 'Angel', 'Portrait', 'Goddess', 'Game CG', 'Bishounen', 'Cowboy', 'Dog', 'Cat', 'Rabbit', 'Starry Sky', 'River', 'Ocean', 'Skyscraper']
      },
    ],
  },
  {
    title: 'Visual Effect',
    coll: [
      {
        title: 'Visual Effect',
        list: ['Cinematic Lighting', 'God Rays', 'Sunlight', 'Reflection Light', 'Depth Offield', 'Full body', 'Profile', 'POV', 'First-Person View', 'Masterpiece']
      },
    ],
  },
  {
    title: 'Posture',
    coll: [
      {
        title: 'Posture',
        list: ['Yoga', 'Pray', 'Salute', 'Gill Support', 'Walk', 'Sitting', 'Standing', 'Lying', 'Selfie', 'Wariza', 'Princess carry']
      },
    ],
  },
]

const AigcBox = (props: { info: Input }): ReactElement => {
  const [active, setActive] = useState<number>(0);
  const [collList, setCollList] = useState<Coll[]>(WordList[0].coll);
  const [wordListS, setWordList] = useState<string[]>([]);
  const [imageWait, setImageWait] = useState<boolean>(false);
  const [upAiWait, setUpAiWait] = useState<boolean>(false);
  const [aiText, setAiTest] = useState<string>('');
  const [wait, setWait] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(100);
  const [modelType, setModelType] = useState<string>('1');
  const [prompts, setPrompts] = useState<string>('');
  const { connectMetamask } = useMetamask();
  const { mint, getBalance, queryERC20Approve, approveToken, tokenMint } = useContract();
  const { state } = useContext(PNft);
  const { switchC } = useSwitchChain();
  const navigate = useNavigate();
  const [aiImageView, setAiImageView] = useState<{ url: string, minio_key: string, ipfs: string ,file_name:string}>({
    url: '',
    minio_key: '',
    ipfs: '',
    file_name: ''
  });
  const selectModel = (value: string) => {
    setModelType(value)
  };
  const [aiReview, setAIReview] = useState<{ url: string, minio_key: string, ipfs: string, file_name: string }>({
    url: '',
    minio_key: '',
    ipfs: '',
    file_name: ''
  });
  //AI Transfer Image
  const uploadFileImageAi = async () => {
    if (wordListS.length < 1) {
      message.error('Please select keywords')
      return
    };
    setImageWait(true);
    const result: any = await axios.post(`${process.env.REACT_APP_BASEURL_AI}/text2img`, {
      prompts: `${wordListS.join(',')}${prompts}`
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
      ipfs: data.img_url_ipfs,
      file_name:''
  });
  };
  const uploadFileAi = async () => {
    if (!aiText) {
      message.error('Please enter a keyword')
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
      ipfs: result.data.voice_url_ipfs,
      file_name:''
    })
  };
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
  const submitMint = async () => {
    if (!state.address) {
      await connectMetamask();
      return
    }
    const r:any = await switchC(+(props.info.chain));
    if(r.code) return
    const balance = await getBalance();
    const numberBalance: number = +balance / 1e18;
    if (numberBalance <= 0) {
      message.warning('Your available balance is insufficient.');
      return
    }
    if (!props.info.name) {
      message.error('Please enter the name');
      return
    };
    if (props.info.labels.length < 1) {
      message.error('Please select at least one NFT Label');
      return
    };
    if (!aiImageView.ipfs) {
      message.error('Please generate NFT file first');
      return
    }
    setWait(true);
    const pay_address = props.info.token_info.address.slice(props.info.token_info.address.length - 8, props.info.token_info.address.length) === '00000000';
    if (!pay_address) {
      const approve_amount = await queryERC20Approve(state.address as string, MintV2ContractAddress, props.info.token_info.address);
      if (+approve_amount / 1e18 < 1) {
        const approve: any = await approveToken(props.info.token_info.address, MintV2ContractAddress);
        if (!approve || approve.message) {
          setWait(false);
          return
        };
        submitMint();
        return
      }
    }
    let data: any = {
      name: props.info.name,
      description: props.info.desc,
      image: aiImageView.ipfs,
      external_url: aiReview?.ipfs || ''
    };
    if (typeof data === 'object') {
      data = JSON.stringify(data, undefined, 4)
    }
    const blob = new Blob([data], { type: 'text/json' });
    const blob_ipfs = await uploadFileFN(`${new Date().getTime()}.json`, blob);
    const result: any = props.info.chain === '8007736' ? await tokenMint(blob_ipfs.ipfshash, props.info.token_info.address) : await mint(blob_ipfs.ipfshash);
    if (!result || result.message) {
      setWait(false);
      return
    };
    const formData = new FormData();
    const NFTAddress = LAND === 'taiko' ? MODE === 'taikomain' ? Address.TaikoContractAddress721Main : Address.TaikoContractAddress721Test : MODE === 'production' ? FilterAddress(state.chain as string).contract_721 : FilterAddress(state.address as string).contract_721_test;
    formData.append('chain_id', props.info.chain);
    formData.append('contract_address', props.info.chain === '8007736' ? MintV2ContractAddress : NFTAddress);
    formData.append('contract_type', props.info.nft_type);
    formData.append('sender', state.address);
    formData.append('tx_hash', result['transactionHash']);
    formData.append('image_file_name', aiImageView.file_name);
    formData.append('voice_file_name', aiReview.file_name || '');
    formData.append('meta_data_ipfs', blob_ipfs.ipfshash);
    formData.append('image_ipfs', aiImageView.ipfs);
    formData.append('voice_ipfs', aiReview.ipfs || '');
    formData.append('name', props.info.name);
    formData.append('description', props.info.desc);
    formData.append('category_id', props.info.category as any);
    formData.append('labels', props.info.labels as any);
    const mintResult = await NFTMintService(formData);
    const { status } = mintResult;
    if (status !== 200) {
      message.error(mintResult.msg);
      return
    }
    message.success('Mint Successfully!');
    setWait(false);
    navigate(`/user/${state.address}`)
  }
  return (
    <div className="aigc-box">
      <div className="img-create-box public-create-box">
        <p className="create-title">
          <IconFont type="icon-tupian" />
          <sup>*</sup>
          Image or 3D Model
        </p>
        <p className="create-remark">Vocabulary generator</p>
        <div className="word-box">
          <div className="left-word">
            <ul className="top-tabs">
              {
                WordList.map((item: Word, index: number) => {
                  return (
                    <li key={index} className={`${active === index ? 'active-tab' : ''}`} onClick={() => {
                      setActive(index);
                      setCollList(item.coll)
                    }}>{item.title}</li>
                  )
                })
              }
            </ul>
            {
              collList.map((item: Coll, index: number) => {
                return (
                  <div className="word-o" key={index}>
                    <p className="o-title">{item.title}</p>
                    <ul className="word-list">
                      {
                        item.list.map((e: string, i: number) => {
                          return (
                            <li key={`${i}-${new Date().getTime()}`} className={`${(wordListS.indexOf(e) > -1) ? 'select-word' : ''}`} onClick={() => {
                              const arr = wordListS;
                              arr.indexOf(e) > -1 ? arr.splice(arr.indexOf(e), 1) : arr.push(e);
                              setWordList([...arr]);
                            }}>
                              <p>{e}</p>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                )
              })
            }
          </div>
          <div className="right-view">
            <div className="prompts-box">
              <p>
                <sup>*</sup>
                Prompts
              </p>
              <div className="review">
                {/* <p>{wordListS.join(',')}</p> */}
                <textarea placeholder="Type in the inscriber or customize the input, split by," value={`${wordListS.join(',')}${prompts}`} onChange={(e) => {
                  setPrompts(e.target.value.substring(wordListS.join(',').length))
                }} />
              </div>
            </div>
            <div className="preview-box">
              <p>
                Preview
              </p>
              <div className="review">
                <Image
                  width='100%'
                  src={aiImageView.url}
                />
              </div>
            </div>
            <p className="generate-btn">
              <Button loading={imageWait} className={`${((wordListS.length + prompts.length) < 1 || imageWait) ? 'dis-btn' : ''}`} disabled={(wordListS.length + prompts.length) < 1 || imageWait} type="primary" onClick={uploadFileImageAi}>Generate image</Button>
            </p>
          </div>
        </div>
      </div>
      <div className="audio-create-box public-create-box">
        <p className="create-title">
          <IconFont type="icon-yinpin" />
          Audio
        </p>
        <div className="public-audio-inp">
          <p><sup>*</sup>Text</p>
          <textarea placeholder="Please enter the text" value={aiText} onChange={(e) => {
            setAiTest(e.target.value)
          }}></textarea>
        </div>
        <div className="public-audio-inp">
          <p><sup>*</sup>Speed</p>
          <div className="progress">
            <Slider marks={marks} min={100} max={200} onChange={(value) => {
              setRate(value);
            }} />
          </div>
        </div>
        <div className="public-audio-inp" style={{ marginTop: '48px' }}>
          <p><sup>*</sup>Model</p>
          <Select
            defaultValue="1"
            onChange={selectModel}
            options={Model}
          />
        </div>
        <div className="public-audio-inp">
          <p><sup>*</sup>Review</p>
          <audio src={aiReview.url} controls></audio>
        </div>
        <p className="generate-btn">
          <Button loading={upAiWait} className={`${aiText.length < 1 || upAiWait ? 'dis-btn' : ''}`} disabled={aiText.length < 1 || upAiWait} type="primary" onClick={uploadFileAi}>Generate Voice</Button>
        </p>
      </div>
      <p className="confirm-btn">
        <Button type="primary" loading={wait} disabled={wait} onClick={submitMint}>Confirm and Mint</Button>
      </p>
    </div>
  )
};

export default AigcBox;