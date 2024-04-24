import { ReactElement, useContext, useState } from "react";
import { Button, Select, Image, message } from "antd";
import { Base64ToFile, CompressImage } from "../../../utils";
import { CloseOutlined } from "@ant-design/icons";
import { useContract } from "../../../utils/contract";
import { PNft } from "../../../App";

export interface Input {
  name: string,
  desc: string,
  collection_type: string,
  symbol: string,
  tokenURI: string,
  decimals: string,
  native_supply: string,
  supply: string,
  limit: string,
  price: string,
  admin: string,
}

interface UPFile {
  source: string | File,
  view: string
}

const CreateCollection = (): ReactElement => {
  const { CreateCollectionWith721, CreateCollectionWith404 } = useContract();
  const { state } = useContext(PNft);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<Input>({
    name: '',
    desc: '',
    collection_type: '721',
    symbol: '',
    tokenURI: '',
    decimals: '',
    native_supply: '',
    supply: '',
    limit: '',
    price: '',
    admin: state.address || ''
  });
  const [logoFile, setLogoFile] = useState<UPFile>({
    source: '',
    view: ''
  });
  const [coverFile, setCoverFile] = useState<UPFile>({
    source: '',
    view: ''
  });
  const [bgFile, setBgFile] = useState<UPFile>({
    source: '',
    view: ''
  });
  //Cover Image
  const selectCover = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setCoverFile({
        source: file,
        view: URL.createObjectURL(file)
      });
    })
  }
  //Logo Image
  const selectLogo = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setLogoFile({
        source: file,
        view: URL.createObjectURL(file)
      });
    })
  }
  //Background Image
  const selectBg = (e: any) => {
    const file = e.target.files[0];
    CompressImage(file, 40, (compressBase64) => {
      const file = Base64ToFile(compressBase64);
      setBgFile({
        source: file,
        view: URL.createObjectURL(file)
      });
    })
  }
  const checkInput = () => {
    if (!input.name) {
      message.error('Please enter the collection name')
      return '0'
    };
    if (!input.symbol) {
      message.error('Please enter the collection symbol')
      return '0'
    };
    if (!input.tokenURI) {
      message.error('Please enter the collection token URI');
      return '0'
    }
    if (!input.admin) {
      message.error('Please enter the collection admin address');
      return '0'
    }
  }
  const resetInput = () => {
    setInput({
      name: '',
      desc: '',
      collection_type: '721',
      symbol: '',
      tokenURI: '',
      decimals: '',
      native_supply: '',
      supply: '',
      limit: '',
      price: '',
      admin: state.address || ''
    })
  }
  const createCollectionWith721 = async () => {
    const pass = checkInput()
    if (pass === '0') return
    console.log(input);
    if (!input.supply) {
      message.error('Please enter the collection supply');
      return
    }
    if (+input.supply < 0) {
      message.error('Please enter the correct supply');
      return
    }
    if (!input.limit) {
      message.error('Please enter the collection limit');
      return
    }
    if (+input.limit < 0) {
      message.error('Please enter the correct limit');
      return
    }
    if (!input.price) {
      message.error('Please enter the collection price');
      return
    }
    if (+input.price < 0) {
      message.error('Please enter the correct price');
      return
    }
    setLoading(true);
    const result: any = await CreateCollectionWith721(input.name, input.symbol, input.tokenURI, +input.supply, +input.limit, +input.price, input.admin);
    console.log(result);
    setLoading(false)
    if (!result || result.message) {
      message.error(result.message)
      return
    }
    message.success('Created successfully')
    resetInput()
  }
  const createCollectionWith404 = async () => {
    const pass = checkInput()
    if (pass === '0') return
    if (!input.decimals) {
      message.error('Please enter the precision');
      return
    }
    if (+input.decimals < 0) {
      message.error('Please enter the correct precision');
      return
    };
    if (!input.native_supply) {
      message.error('Please enter the total native supply');
      return
    }
    if (+input.native_supply < 0) {
      message.error('Please enter the correct total local supply');
      return
    };
    setLoading(true);
    const result: any = await CreateCollectionWith404(input.name, input.symbol, input.tokenURI, +input.decimals, +input.native_supply, input.admin);
    console.log(result);
    setLoading(false)
    if (!result || result.message) {
      message.error(result.message)
      return
    }
    message.success('Created successfully');
    resetInput()
  }
  return (
    <div className="create-collection">
      <div className="input-box">
        <div className="public-inp-box">
          <p><sup>*</sup>Name</p>
          <input className="other-in" value={input.name} onChange={(e) => {
            setInput({
              ...input,
              name: e.target.value
            })
          }} type="text" placeholder="Please enter the name" />
        </div>
        <div className="public-inp-box">
          <p><sup>*</sup>Symbol</p>
          <input className="other-in" value={input.symbol} onChange={(e) => {
            setInput({
              ...input,
              symbol: e.target.value
            })
          }} type="text" placeholder="Please enter the symbol" />
        </div>
        <div className="public-inp-box">
          <p>Describtion(Optional)</p>
          <textarea placeholder="Please enter the describtion" value={input.desc} onChange={(e) => {
            setInput({
              ...input,
              desc: e.target.value
            })
          }}></textarea>
        </div>
        <div className="more-up-img">
          <div className="public-inp-box">
            <p><sup>*</sup>Upload cover image</p>
            {!coverFile.view
              ? <div className="upload-img-box">
                <input type="file" accept="image/*" onChange={selectCover} />
                <img src={require('../../../assets/images/up_file.png')} alt="" />
              </div>
              : <div className="review-box">
                <div className="review-inner">
                  <Image
                    width={250}
                    src={coverFile.view}
                  />
                </div>
                <div className="delete-file" onClick={() => {
                  setCoverFile({
                    source: '',
                    view: ''
                  })
                }}>
                  <CloseOutlined />
                </div>
              </div>}
            <p className="up-remark">File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB, GLTF. Max size: 100 MB</p>
          </div>
          <div className="public-inp-box">
            <p><sup>*</sup>Upload logo</p>
            {!logoFile.view
              ? <div className="upload-img-box">
                <input type="file" accept="image/*" onChange={selectLogo} />
                <img src={require('../../../assets/images/up_file.png')} alt="" />
              </div>
              : <div className="review-box">
                <div className="review-inner">
                  <Image
                    width={250}
                    src={logoFile.view}
                  />
                </div>
                <div className="delete-file" onClick={() => {
                  setLogoFile({
                    source: '',
                    view: ''
                  })
                }}>
                  <CloseOutlined />
                </div>
              </div>}
            <p className="up-remark">File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB, GLTF. Max size: 100 MB</p>
          </div>
        </div>
        <div className="public-inp-box">
          <p><sup>*</sup>Upload background image</p>
          {!bgFile.view
            ? <div className="upload-img-box">
              <input type="file" accept="image/*" onChange={selectBg} />
              <img src={require('../../../assets/images/up_file.png')} alt="" />
            </div>
            : <div className="review-box review-box-w">
              <div className="review-inner">
                <Image
                  width={'100%'}
                  src={logoFile.view}
                />
              </div>
              <div className="delete-file" onClick={() => {
                setBgFile({
                  source: '',
                  view: ''
                })
              }}>
                <CloseOutlined />
              </div>
            </div>}
          <p className="up-remark">File types supported: JPG, PNG, GIF, SVG, WEBM, WAV,OGG, GLB, GLTF. Max size: 100 MB</p>
        </div>
        <div className="public-inp-box">
          <p><sup>*</sup>Collection Type</p>
          <Select
            value={input.collection_type}
            onChange={(val: string) => {
              setInput({
                ...input,
                collection_type: val
              })
            }}
            options={[
              { value: '721', label: 'ERC721' },
              { value: '404', label: 'ERC404' },
            ]}
          />
        </div>
        <div className="public-inp-box">
          <p><sup>*</sup>Token URI</p>
          <input className="other-in" value={input.tokenURI} onChange={(e) => {
            setInput({
              ...input,
              tokenURI: e.target.value
            })
          }} type="text" placeholder="Please enter the token uri" />
        </div>
        {
          input.collection_type === '404' && <div className="public-inp-box">
            <p><sup>*</sup>Decimals</p>
            <input className="other-in" onWheel={event => (event.target as HTMLElement).blur()} value={input.decimals} onChange={(e) => {
              setInput({
                ...input,
                decimals: e.target.value
              })
            }} type="number" placeholder="Please enter the decimals" />
          </div>
        }
        {
          input.collection_type === '404' && <div className="public-inp-box">
            <p><sup>*</sup>Total Native Supply</p>
            <input className="other-in" onWheel={event => (event.target as HTMLElement).blur()} value={input.native_supply} onChange={(e) => {
              setInput({
                ...input,
                native_supply: e.target.value
              })
            }} type="number" placeholder="Please enter the total native supply" />
          </div>
        }
        {
          input.collection_type === '721' && <div className="public-inp-box">
            <p><sup>*</sup>Supply</p>
            <input className="other-in" onWheel={event => (event.target as HTMLElement).blur()} value={input.supply} onChange={(e) => {
              setInput({
                ...input,
                supply: e.target.value
              })
            }} type="number" placeholder="Please enter the supply" />
          </div>
        }
        {
          input.collection_type === '721' && <div className="public-inp-box">
            <p><sup>*</sup>Limit</p>
            <input className="other-in" onWheel={event => (event.target as HTMLElement).blur()} value={input.limit} onChange={(e) => {
              setInput({
                ...input,
                limit: e.target.value
              })
            }} type="number" placeholder="Please enter the limit" />
          </div>
        }
        {
          input.collection_type === '721' && <div className="public-inp-box">
            <p><sup>*</sup>Price</p>
            <input className="other-in" onWheel={event => (event.target as HTMLElement).blur()} value={input.price} onChange={(e) => {
              setInput({
                ...input,
                price: e.target.value
              })
            }} type="number" placeholder="Please enter the price" />
          </div>
        }
        <div className="public-inp-box">
          <p><sup>*</sup>Admin</p>
          <input className="other-in" value={input.admin} onChange={(e) => {
            setInput({
              ...input,
              admin: e.target.value
            })
          }} type="text" placeholder="Please enter the admin" />
        </div>
        <div className="public-inp-box">
          <p className="submit-btn">
            <Button type="primary" loading={loading} disabled={loading} onClick={() => {
              input.collection_type === '721' ? createCollectionWith721() : createCollectionWith404();
            }}>Submit</Button>
          </p>
        </div>
      </div>
    </div>
  )
};

export default CreateCollection;