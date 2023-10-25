import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { DownOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import copy from 'copy-to-clipboard'
import { Button, Checkbox, Select, Spin, message } from "antd";
import { PNft } from "../../../App";
import { calsAddress } from '../../../utils/index';
import IconFont from "../../../utils/icon";
import { ProfileService } from "../../../request/api";
import DefaultAvatar from "../../../components/default_avatar/default.avatar";
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
    const [player, setPlayer] = useState<any>();
    const [playS, setPlay] = useState<boolean>(false);
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
                <div className="new-card-msg-2">
                    <div className="address-msg">
                        <p className="user-name">{profile.user_name}</p>
                        <p className="user-address-2">
                            {calsAddress(profile.user_address ? profile.user_address : '')}
                            <IconFont type="icon-fuzhi_copy" onClick={() => {
                                copy(profile.user_address)
                                message.success('Copy Successful')
                            }} />
                        </p>
                        <div className="play-audio">
                            <div className="play-btn" onClick={(e) => {
                                if (!profile.audio_url) {
                                    message.warning('Not set');
                                    return
                                };
                                e.stopPropagation();
                                if (playS) {
                                    player.pause();
                                    setPlay(false);
                                    setPlayer(null);
                                    return
                                }
                                const play = document.createElement('audio');
                                setPlayer(play)
                                play.src = profile.audio_url;
                                play.loop = false;
                                play.play();
                            }}>
                                <p><IconFont type="icon-bofang_play-one" /></p>
                            </div>
                            <img src={require('../../../assets/new/new_wave_2.png')} alt="" />
                        </div>
                        <div className="set-box-2" onClick={() => {
                            navigate('/profile')
                        }}>
                            <SettingOutlined />
                        </div>
                        <div className="otside-url">
                            <IconFont type="icon-twitter-logo-bold" onClick={() => {
                                if (!profile.auth_twitter) {
                                    message.warning('Not set');
                                    return
                                }
                                window.open(profile.auth_twitter)
                            }} />
                            <IconFont type="icon-discord-logo-bold" onClick={() => {
                                if (!profile.auth_discord) {
                                    message.warning('Not set');
                                    return
                                }
                                window.open(profile.auth_discord)
                            }} />
                            <IconFont className="icon-link" type="icon-globe-simple-bold" onClick={() => {
                                if (!profile.link) {
                                    message.warning('Not set');
                                    return
                                }
                                window.open(profile.link)
                            }} />
                            <p>{profile.link}</p>
                        </div>
                    </div>
                    <div className="set-box" onClick={() => {
                        navigate('/profile')
                    }}>
                        <SettingOutlined />
                    </div>
                </div>
                <div className="address-msg-2">
                    <p>
                        {calsAddress(profile.user_address ? profile.user_address : '')}
                        <IconFont type="icon-fuzhi_copy" onClick={() => {
                            copy(profile.user_address)
                            message.success('Copy Successful')
                        }} />
                    </p>
                    {/* <p>Joined July 2022</p> */}
                </div>
            </div>
        </div>
    )
};

export default OwnerCard;