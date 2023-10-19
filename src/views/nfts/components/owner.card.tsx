import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { CaretRightOutlined, CopyOutlined, DownOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import copy from 'copy-to-clipboard'
import { Affix, Button, Checkbox, Select, Spin, message } from "antd";
import { PNft } from "../../../App";
import { calsAddress } from '../../../utils/index';
import IconFont from "../../../utils/icon";
import { ProfileService } from "../../../request/api";
import DefaultAvatar from "../../../components/default_avatar/default.avatar";
import { VERSION, flag } from '../../../utils/source';
import { useNavigate, useSearchParams } from "react-router-dom";
interface Props {
    updateBG: (val: string) => void,
    updateList: (val: number) => void
}

const OwnerCard = (props: Props): ReactElement => {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const { state } = useContext(PNft)
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [tab, setTab] = useState<number>(0);
    const [show, setShow] = useState<{
        collection: boolean,
        price: boolean,
        currency: boolean
    }>({
        collection: false,
        price: false,
        currency: false
    })
    const [profile, setProfile] = useState<any>({
        avatar_url: '1'
    });
    const otherProfile = async () => {
        // console.log(searchParams.get('address'))
        const account = await ProfileService({
            user_address: searchParams.get('address')
        });
        setProfile(account.data);
        props.updateBG(account.data.bgimage_url);
    };
    useEffect(() => {
        if (!searchParams.get('address')) {
            navigate('/')
        }
    }, [])
    useEffect(() => {
        const address: string = searchParams.get('address') ? searchParams.get('address') as string : ''
        address === state.address ? setProfile(state.account) : otherProfile();
    }, [searchParams.get('address')]);
    return (
        <div className="owner-card">
            <div className="account-msg">
                <div className="avatar-box">
                    {profile.avatar_url
                        ? <img onLoad={() => {
                            setLoading(false)
                        }} src={profile.avatar_url} alt="" />
                        : <DefaultAvatar diameter={220} address={profile.user_address} />
                    }
                    {profile.avatar_url && loading && <div className="loading-avatar">
                        <Spin />
                    </div>}
                </div>
                <div className="new-card-msg">
                    <div className="address-msg">
                        <div className="name-address">
                            <p className="name">{profile.user_name ? profile.user_name : '-'}</p>
                            <p className="copy-address">
                                <span>{calsAddress(profile.user_address ? profile.user_address as string : '')}</span>
                                <span>Join time&nbsp;{`July 2022`}</span>
                            </p>
                        </div>
                        <div className="sel-tabs">
                            {
                                ['On Sales', 'Items'].map((item: string, index: number) => {
                                    return (
                                        <p key={index} className={`${tab === index ? 'select-tab' : ''}`} onClick={() => {
                                            props.updateList(index);
                                            setTab(index)
                                        }}>{item}</p>
                                    )
                                })
                            }
                        </div>
                        <div className="public-title" onClick={() => {
                            setShow({
                                ...show,
                                collection: !show.collection
                            })
                        }}>
                            <p>Collections</p>
                            <p className={`${show.collection ? 'hide-arrow' : ''}`}>
                                <DownOutlined />
                            </p>
                        </div>
                        <div className={`col-box ${show.collection ? 'hide-box' : ''}`}>
                            <div className="search-inp">
                                <SearchOutlined />
                                <input type="text" placeholder="Search" />
                            </div>
                            <p>
                                <span>COLLECTION</span>
                                <span>VALUE</span>
                            </p>
                        </div>
                        <div className="public-title" onClick={() => {
                            setShow({
                                ...show,
                                price: !show.price
                            })
                        }}>
                            <p>Price</p>
                            <p className={`${show.price ? 'hide-arrow' : ''}`}>
                                <DownOutlined />
                            </p>
                        </div>
                        <div className={`price-box ${show.price ? 'hide-box' : ''}`}>
                            <Select
                                defaultValue="lucy"
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                    { value: 'lucy', label: 'Lucy' },
                                    { value: 'Yiminghe', label: 'yiminghe' },
                                    { value: 'disabled', label: 'Disabled', disabled: true },
                                ]}
                            />
                            <div className="limit-box">
                                <input type="number" placeholder="Min" />
                                <p>to</p>
                                <input type="number" placeholder="Max" />
                            </div>
                            <p className="apply-b">
                                <Button>Apply</Button>
                            </p>
                        </div>
                        <div className="public-title" onClick={() => {
                            setShow({
                                ...show,
                                currency: !show.currency
                            })
                        }}>
                            <p>Currency</p>
                            <p className={`${show.currency ? 'hide-arrow' : ''}`}>
                                <DownOutlined />
                            </p>
                        </div>
                        <div className={`cur-box ${show.currency ? 'hide-box' : ''}`}>
                            <div className="search-inp">
                                <SearchOutlined />
                                <input type="text" placeholder="Search" />
                            </div>
                            <Checkbox.Group options={plainOptions} defaultValue={['Apple']} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default OwnerCard;