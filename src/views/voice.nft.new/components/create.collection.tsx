import { ReactElement, useState } from "react";
import { Button, Select } from "antd";

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

const CreateCollection = (): ReactElement => {
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
    admin: ''
  });
  const createCollectionWith721 = async () => {
    console.log('Create collection with ERC721');
  }
  const createCollectionWith404 = async () => {
    console.log('Create collection with ERC404');
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
          <input className="other-in" value={input.name} onChange={(e) => {
            setInput({
              ...input,
              symbol: e.target.value
            })
          }} type="text" placeholder="Please enter the symbol" />
        </div>
        <div className="public-inp-box">
          <p><sup>*</sup>Describtion(Optional)</p>
          <textarea placeholder="Please enter the describtion" value={input.desc} onChange={(e) => {
            setInput({
              ...input,
              desc: e.target.value
            })
          }}></textarea>
        </div>
        <div className="public-inp-box">
          <p><sup>*</sup>Poster</p>
          
        </div>
        <div className="public-inp-box">
          <p><sup>*</sup>Background Image</p>
          
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
          <input className="other-in" value={input.name} onChange={(e) => {
            setInput({
              ...input,
              tokenURI: e.target.value
            })
          }} type="text" placeholder="Please enter the token uri" />
        </div>
        {
          input.collection_type === '404' && <div className="public-inp-box">
            <p><sup>*</sup>Decimals</p>
            <input className="other-in" value={input.name} onChange={(e) => {
              setInput({
                ...input,
                decimals: e.target.value
              })
            }} type="text" placeholder="Please enter the decimals" />
          </div>
        }
        {
          input.collection_type === '404' && <div className="public-inp-box">
            <p><sup>*</sup>Total Native Supply</p>
            <input className="other-in" value={input.name} onChange={(e) => {
              setInput({
                ...input,
                native_supply: e.target.value
              })
            }} type="text" placeholder="Please enter the total native supply" />
          </div>
        }
        {
          input.collection_type === '721' && <div className="public-inp-box">
            <p><sup>*</sup>Supply</p>
            <input className="other-in" value={input.name} onChange={(e) => {
              setInput({
                ...input,
                supply: e.target.value
              })
            }} type="text" placeholder="Please enter the supply" />
          </div>
        }
        {
          input.collection_type === '721' && <div className="public-inp-box">
            <p><sup>*</sup>Limit</p>
            <input className="other-in" value={input.name} onChange={(e) => {
              setInput({
                ...input,
                limit: e.target.value
              })
            }} type="text" placeholder="Please enter the limit" />
          </div>
        }
        {
          input.collection_type === '721' && <div className="public-inp-box">
            <p><sup>*</sup>Price</p>
            <input className="other-in" value={input.name} onChange={(e) => {
              setInput({
                ...input,
                price: e.target.value
              })
            }} type="text" placeholder="Please enter the price" />
          </div>
        }
        <div className="public-inp-box">
          <p><sup>*</sup>Admin</p>
          <input className="other-in" value={input.name} onChange={(e) => {
            setInput({
              ...input,
              native_supply: e.target.value
            })
          }} type="text" placeholder="Please enter the admin" />
        </div>
        <div className="public-inp-box">
          <p className="submit-btn">
            <Button type="primary" onClick={() => {
              input.collection_type === '721' ? createCollectionWith721() : createCollectionWith404();
            }}>Submit</Button>
          </p>
        </div>
      </div>
    </div>
  )
};

export default CreateCollection;