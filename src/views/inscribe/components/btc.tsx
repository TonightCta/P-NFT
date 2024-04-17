import { Button, Select } from "antd";
import { ReactElement, useState } from "react";

interface Net {
  value: string,
  label: string,
  logo: string,
}

const BtcIns = (): ReactElement => {
  const [selectNet, setSelectNet] = useState<string>('btcmain');
  const [step, setStep] = useState<string>('Mint')
  return (
    <div className="btc-ins">
      <p className="public-label">
        <sup>*</sup>
        Network
      </p>
      <div className="public-inp-box">
        <Select
          defaultValue={selectNet}
          listHeight={400}
        >
          {
            [{ value: 'btcmain', label: 'Bitcoin', logo: require('../../../assets/images/bitcoin.logo.png') }].map((item: Net, index: number) => {
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
            ['Mint', 'Depoly', 'Transfer'].map((item: string, index: number) => {
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
      <p className="public-label t-5">
        <sup>*</sup>
        Ticker
      </p>
      <div className="public-inp-box">
        <input type="text" placeholder="4 Characters" />
      </div>
      {step === 'Mint' && <div className="dis-box">
        <div className="left-amount public-dis">
          <p className="public-label t-3">
            <sup>*</sup>
            Amount
          </p>
          <div className="inp-box">
            <input type="text" placeholder="Mint Amount" />
          </div>
        </div>
        <div className="right-repeat public-dis">
          <p className="public-label t-3">
            <sup>*</sup>
            Repeat Mint
          </p>
          <div className="inp-box">
            <div className="select-q">1</div>
            <div className="select-q">10</div>
            <input type="number" placeholder="1-25" disabled/>
          </div>
        </div>
      </div>}
      {step === 'Depoly' && <div className="dis-box">
        <div className="left-amount public-dis">
          <p className="public-label t-3">
            <sup>*</sup>
            Total Supply
          </p>
          <div className="inp-box">
            <input type="number" placeholder="The maximum supply of the token" />
          </div>
        </div>
        <div className="right-repeat public-dis">
          <p className="public-label t-3">
            <sup>*</sup>
            Limit Per Mint
          </p>
          <div className="inp-box">
            <input type="number" placeholder="The maximum amount per transaction"/>
          </div>
        </div>
      </div>}
      <div className="submit-btn">
        <Button type="default">Coming Soon</Button>
      </div>
    </div>
  )
};

export default BtcIns;