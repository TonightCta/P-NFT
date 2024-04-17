import { Button, Select } from "antd";
import { ReactElement, useContext, useState } from "react";
import { Config, NetworkConfig } from "../../../utils/source";
import { PNft } from "../../../App";
import { CopyOutlined } from "@ant-design/icons";

const EvmIns = (): ReactElement => {
  const [step, setStep] = useState<string>('Text Mode');
  const { state } = useContext(PNft);
  const [textStep, setTextStep] = useState<string>('Single');
  const selectChain = (val: string) => {
    console.log(val);
  }
  return (
    <div className="evm-ins">
      <p className="public-label">
        <sup>*</sup>
        Network
      </p>
      <div className="public-inp-box">
        <Select
          defaultValue={state.chain as string}
          onChange={selectChain}
          listHeight={400}
        >
          {
            NetworkConfig.map((item: Config) => {
              return {
                value: item.chain_id,
                label: item.chain_name,
                logo: item.chain_logo,
              }
            }).map((item: { value: string, label: string, logo: string }, index: number) => {
              return (
                <Select.Option key={index} value={item.value}>
                  <div className="select-custom-option">
                    <img src={item.logo} alt="" />
                    <p>{item.label}</p>
                  </div>
                </Select.Option>
              )
            })
          }

        </Select>
      </div>
      <div className="tabs-step-2">
        <ul>
          {
            ['Text Mode', 'HEX Mode'].map((item: string, index: number) => {
              return (
                <li key={index} className={`${item === step ? 'active-step' : ''}`} onClick={() => {
                  setStep(item)
                }}>
                  <p>{item}</p>
                  <p className="active-line"></p>
                </li>
              )
            })
          }
        </ul>
      </div>
      {step === 'Text Mode' && <div className="text-mode-box">
        <div className="text-tabs">
          <ul>
            {
              ['Single', 'Bulk'].map((item: string, index: number) => {
                return (
                  <li key={index} onClick={() => {
                    setTextStep(item)
                  }} className={`${textStep === item ? 'active-mode' : ''}`}>{item}</li>
                )
              })
            }
          </ul>
        </div>
        <p className="single-remark">Please follow the format below to edit or input directly</p>
        <p className="text-a">
          <textarea name="" id="" placeholder="data:,&#10;{“p“: “prc-20”.”op”:”mint:,”tick”:”dino”,”amt”;”1000000000”}"></textarea>
        </p>
        {textStep === 'Single' && <div className="single-children">
          <p className="add-t">Add Template</p>
          <div className="dis-box">
            <div className="left-unknow public-dis">
              <input type="text" />
              <CopyOutlined />
            </div>
            <div className="right-mint public-dis">
              <p className="public-label">
                <sup>*</sup>
                Repeat Mint
              </p>
              <div className="inp-box">
                <div className="select-q">1</div>
                <div className="select-q">50</div>
                <input type="number" placeholder="1-50" disabled />
              </div>
              <div className="mint-remrak">
                <p>Single transaction limit is 50</p>
                <p>1/50</p>
              </div>
            </div>
          </div>
        </div>}
      </div>}
      {step === 'HEX Mode' && <div className="hex-mode-box">
        <div className="unknow-inp">
          <input type="text" />
        </div>
        <div className="dis-box">
          <div className="left-unknow public-dis">
            <input type="text" />
            <CopyOutlined />
          </div>
          <div className="right-mint public-dis">
            <p className="public-label">
              <sup>*</sup>
              Repeat Mint
            </p>
            <div className="inp-box">
              <div className="select-q">1</div>
              <div className="select-q">50</div>
              <input type="number" placeholder="1-50" disabled />
            </div>
            <div className="mint-remrak">
              <p>Single transaction limit is 50</p>
              <p>1/50</p>
            </div>
          </div>
        </div>
      </div>}
      <div className="submit-btn">
        <Button type="default">Coming Soon</Button>
      </div>
    </div>
  )
};

export default EvmIns;