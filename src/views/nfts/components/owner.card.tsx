import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { CaretRightOutlined, CopyOutlined, SettingOutlined } from "@ant-design/icons";
import copy from 'copy-to-clipboard'
import { Affix, Button, Spin, message } from "antd";
import { PNft } from "../../../App";
import { calsAddress } from '../../../utils/index';
import IconFont from "../../../utils/icon";
import { ProfileService } from "../../../request/api";
import DefaultAvatar from "../../../components/default_avatar/default.avatar";
import { VERSION, flag } from '../../../utils/source';
import { useNavigate } from "react-router-dom";
interface Props {
    updateBG: (val: string) => void
}

const OwnerCard = (props: Props): ReactElement => {
    const { state } = useContext(PNft)
    const audioRef: any = useRef('');
    const navigate = useNavigate();
    const [play, setPlay] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [profile, setProfile] = useState<any>({
        avatar_url: '1'
    });
    const otherProfile = async () => {
        const account = await ProfileService({
            user_address: state.owner_address
        });
        setProfile(account.data);
        props.updateBG(account.data.bgimage_url);
    };
    useEffect(() => {
        state.owner_address === state.address ? setProfile(state.account) : otherProfile();
    }, [state.owner_address]);
    return (
        <Affix offsetTop={flag ? -300 : 200}>
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
                    <div className="address-msg">
                        <div className="name-address">
                            <p className="name">{profile.user_name ? profile.user_name : '-'}</p>
                            <p className="copy-address">
                                {calsAddress(profile.user_address ? profile.user_address as string : '')}
                                <CopyOutlined onClick={() => {
                                    copy(profile.user_address as string);
                                    message.success('Copy Successfully!')
                                }} />
                            </p>
                        </div>
                        <div className="audio-box">
                            <div className="play-btn" onClick={() => {
                                if (!profile.audio_url) {
                                    message.error('User has not set a sound intro');
                                    return
                                }
                                setPlay(play ? false : true);
                                play ? audioRef.current.pause() : audioRef.current.play();
                            }}>
                                {play ? <IconFont type="icon-tingzhi" /> : <CaretRightOutlined />}
                                <audio src={profile.audio_url} ref={audioRef}></audio>
                            </div>
                            <div className="audio-progress">
                                {
                                    VERSION === 'old'
                                        ? <img src={require('../../../assets/images/audio_bg.png')} alt="" />
                                        : <img src={require('../../../assets/new/progress_bg.png')} alt="" />}
                            </div>
                            <p className="audio-end"></p>
                        </div>
                        <div className="set-box-mobile">
                            <Button type="default" onClick={() => {
                                navigate('/profile')
                            }}>
                                <SettingOutlined />
                                Setting
                            </Button>
                        </div>
                    </div>
                    {VERSION === 'old' && <div className="outside-url">
                        <IconFont type="icon-globe-simple-bold" />
                        <div className={`${profile.link && 'with-hand'}`} onClick={() => {
                            profile.link && window.open(profile.link as string)
                        }}>
                            <p>{profile.link ? profile.link : '-'}</p>
                        </div>
                    </div>}
                    {
                        VERSION === 'new' && <div className="set-box">
                            <Button type="default" onClick={() => {
                                navigate('/profile')
                            }}>
                                <SettingOutlined />
                                Setting
                            </Button>
                        </div>
                    }
                    <div className="ourside-account">
                        <div className="outside-url-mobile">
                            <IconFont type="icon-globe-simple-bold" />
                            <div className={`${profile.link && 'with-hand'}`} onClick={() => {
                                profile.link && window.open(profile.link as string)
                            }}>
                                <p>{profile.link ? profile.link : '-'}https://www.baidu.com</p>
                            </div>
                        </div>
                        <p>
                            <IconFont type="icon-twitter-logo-bold" onClick={() => {
                                profile.auth_twitter ? window.open(profile.auth_twitter) : message.error('The user has not set up a Twitter account');
                            }} />
                            <IconFont type="icon-discord-logo-bold" onClick={() => {
                                profile.auth_discord ? window.open(profile.auth_twitter) : message.error('The user has not set up a Discord account');
                            }} />
                        </p>
                    </div>
                </div>
            </div>
        </Affix>
    )
};

export default OwnerCard;