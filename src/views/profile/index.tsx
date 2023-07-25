import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { CloudUploadOutlined, EditOutlined } from '@ant-design/icons'
import { ProfileService, EditAvatarService, EditProfileService, QueryFile, AuthTwitterService, UploadAudioService, UploadBackGroundService } from "../../request/api";
import './index.scss'
import { PNft } from "../../App";
import { calsAddress } from "../../utils";
import IconFont from "../../utils/icon";
import { Button, Spin, message } from "antd";
import { Type } from "../../utils/types";
import axios from "axios";
import MaskCard from "../../components/mask";
import { useMediaRecorder } from "../../hooks/record";
import Recording from "../voice.nft/components/recording";
import ConnectModal from "./components/modal";

interface Profile {
    username: string,
    bio: string,
    email_address: string,
    links: string
}

interface Error {
    name: boolean,
    bio: boolean,
    email: boolean,
    link: boolean
}

const ProfileView = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(PNft);
    const [wait, setWait] = useState<boolean>(false);
    const [save, setSave] = useState<boolean>(false);
    const [profile, setProfile] = useState<Profile>({
        username: state.account.user_name,
        bio: state.account.bio,
        email_address: state.account.email,
        links: state.account.link
    });
    const [error, setError] = useState<Error>({
        name: false,
        bio: false,
        email: false,
        link: false
    });
    const [custom,setCustom] = useState<boolean>(false);
    const [record, setRecord] = useState<boolean>(false);
    const { audioFile, mediaUrl, startRecord, stopRecord } = useMediaRecorder();
    const [audio, setAudio] = useState<string>('');
    const audioRef: any = useRef('');
    const [upAvatar, setUpAvatar] = useState<boolean>(false);
    const upDateAccount = async () => {
        const account = await ProfileService({
            user_address: state.address
        });
        const setAvatar = async () => {
            const result = await QueryFile({
                name: account.data.avatar_minio
            });
            dispatch({
                type: Type.SET_AVATAR,
                payload: {
                    avatar: result.data
                }
            })
        };
        account.data.avatar_minio && setAvatar();
        dispatch({
            type: Type.SET_ACCOUNT,
            payload: {
                account: account.data
            }
        })
    };
    //Save information
    const submitSave = async () => {
        const check = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!profile.username) {
            setError({
                ...error,
                name: true
            });
            return
        }
        if (!profile.bio) {
            setError({
                ...error,
                bio: true
            });
            return
        }
        if (!profile.email_address) {
            setError({
                ...error,
                email: true
            });
            return
        }
        if (!check.test(profile.email_address)) {
            setError({
                ...error,
                email: true
            });
            return
        }
        if (!profile.links) {
            setError({
                ...error,
                link: true
            });
            return
        };
        setWait(true)
        const params = {
            user_address: state.address,
            user_name: profile.username,
            bio: profile.bio,
            link: profile.links,
            email: profile.email_address
        };
        const result: any = await EditProfileService(params);
        setWait(false)
        const { status } = result;
        if (status !== 200) {
            message.error(result.msg);
            return
        };
        message.success('Update Completed!')
        upDateAccount()
    };
    //Save avatar
    const selectAvatar = async (e: any) => {
        setUpAvatar(true);
        const formdata = new FormData();
        formdata.append('user_address', state.address as string);
        formdata.append('avatar', e.target.files[0]);
        const result: any = await EditAvatarService(formdata);
        setUpAvatar(false);
        const { status } = result;
        if (status !== 200) {
            message.error(result.msg);
            return
        };
        message.success('Update Completed')
        upDateAccount();
    };
    //Bind Twitter
    const bindTwitterFN = async () => {
        const result = await AuthTwitterService({
            chain_id: '8007736',
            user_address: state.address
        });
        const { data } = result;
        const features =
            "height=800, width=1366, top=100, left=100, toolbar=no, menubar=no,scrollbars=no,resizable=no";
        window.open(
            data,
            "NEW",
            features
        );
        const timer: NodeJS.Timer = setInterval(async () => {
            if (sessionStorage.getItem('clearInterval')) {
                sessionStorage.removeItem('clearInterval')
                clearInterval(timer);
                return
            }
            if (localStorage.getItem('oauth_token')) {
                const result: any = await axios.get(`${process.env.REACT_APP_BASEURL}/twitter/maketoken?oauth_token=${localStorage.getItem('oauth_token')}&oauth_verifier=${localStorage.getItem('oauth_verifier')}`);
                const { status } = result.data;
                if (status !== 200) {
                    message.error(result.data.msg);
                    return
                };
                message.success('Bind Successfully!');
                sessionStorage.setItem('clearInterval', '1');
                localStorage.removeItem('oauth_token')
                localStorage.removeItem('oauth_verifier');
                clearInterval(timer);
                upDateAccount();
            }
        }, 1000 * 10)
    };
    //Save voice
    const saveVioceFN = async () => {
        if (!mediaUrl) {
            message.error('You did not start recording');
            return
        };
        setSave(true);
        const formdata = new FormData();
        formdata.append('user_address', state.address as string);
        formdata.append('audio', audioFile as File);
        const result = await UploadAudioService(formdata);
        setSave(false);
        const { status } = result;
        if (status !== 200) {
            message.error(result.msg);
            return
        };
        message.success('Update Completed!')
        upDateAccount();
    };
    //Custom background
    const selectCustomBack = async (e:any) => {
        setCustom(true);
        const formdata = new FormData();
        formdata.append('user_address',state.address as string);
        formdata.append('bgimg',e.target.files[0] as File);
        const result = await UploadBackGroundService(formdata);
        setCustom(false);
        const { status } = result;
        if (status !== 200) {
            message.error(result.msg);
            return
        };
        message.success('Update Completed!')
        upDateAccount();
    };
    useEffect(() => {
        setAudio(mediaUrl ? mediaUrl : state.account.audio_url);
        setTimeout(() => {
            mediaUrl && audioRef.current.play()
        }, 100)
    }, [mediaUrl]);
    return (
        <div className="profile-view">
            <MaskCard />
            <div className="up-mask">
                <div className="edit-msg">
                    <p className="profile-name">Profile</p>
                    <div className="mobile-edit-avatar">
                        <div className="avatar-box">
                            <div className="img-box">
                                <img src={state.account.avatar_url ? state.account.avatar_url : require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                                <div className="edit-btn">
                                    <input type="file" title="Select File" accept="image/*" onChange={selectAvatar} />
                                    <EditOutlined />
                                </div>
                                {
                                    upAvatar && <div className="loading-up">
                                        <Spin />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="public-inp">
                        <p className="inp-label">Username</p>
                        <input type="text" className={`${error.name ? 'f-border' : ''}`} onFocus={() => {
                            setError({
                                ...error,
                                name: false
                            })
                        }} placeholder="Username" value={profile.username} onChange={(e) => {
                            setProfile({
                                ...profile,
                                username: e.target.value
                            })
                        }} />
                    </div>
                    <div className="public-inp">
                        <p className="inp-label">Bio</p>
                        <input type="text" className={`${error.bio ? 'f-border' : ''}`} onFocus={() => {
                            setError({
                                ...error,
                                bio: false
                            })
                        }} placeholder="Bio" value={profile.bio} onChange={(e) => {
                            setProfile({
                                ...profile,
                                bio: e.target.value
                            })
                        }} />
                    </div>
                    <div className="public-inp">
                        <p className="inp-label">Email Address</p>
                        <input type="text" className={`${error.email ? 'f-border' : ''}`} onFocus={() => {
                            setError({
                                ...error,
                                email: false
                            })
                        }} placeholder="Email address" value={profile.email_address} onChange={(e) => {
                            setProfile({
                                ...profile,
                                email_address: e.target.value
                            })
                        }} />
                    </div>
                    <div className="outside-account">
                        <p>Social Connections</p>
                        <p className="outside-remark">Help collectors verify your account by connecting social accounts</p>
                        <ul>
                            <li>
                                <IconFont style={{color:`${state.account.auth_twitter ? 'rgb(29, 155, 240)' : ''}`}} type="icon-tuitetwitter43" onClick={() => {
                                    !state.account.auth_twitter && bindTwitterFN()
                                }} />
                            </li>
                            <li>
                                <IconFont type="icon-discord" onClick={() => {
                                    message.info('Under Construction');
                                }}/>
                            </li>
                        </ul>
                    </div>
                    <div className="public-inp">
                        <p className="inp-label">Links</p>
                        <input type="text" className={`${error.link ? 'f-border' : ''}`} onFocus={() => {
                            setError({
                                ...error,
                                link: false
                            })
                        }} placeholder="Links" value={profile.links} onChange={(e) => {
                            setProfile({
                                ...profile,
                                links: e.target.value
                            })
                        }} />
                    </div>
                    <div className="public-inp">
                        <p className="inp-label">Wallet Address</p>
                        <input type="text" placeholder="Wallet Address" value={calsAddress(state.address as string)} readOnly />
                    </div>
                </div>
                <div className="edit-save">
                    <div className="avatar-box">
                        <p>Profile Image</p>
                        <div className="img-box">
                            <img src={state.account.avatar_url ? state.account.avatar_url : require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                            <div className="edit-btn">
                                <input type="file" title="Select File" accept="image/*" onChange={selectAvatar} />
                                <EditOutlined />
                            </div>
                            {
                                upAvatar && <div className="loading-up">
                                    <Spin />
                                </div>
                            }
                        </div>
                        <div className="voice-remark">
                            <p>Voice Introduction</p>
                            <div className="record-box">
                                <div className="record-btn">
                                    <div className="btn-start" onClick={() => {
                                        setRecord(record ? false : true)
                                        !record ? startRecord() : stopRecord()
                                    }}>
                                        {!record ? <img src={require('../../assets/images/record_icon.png')} alt="" />
                                            : <Recording />}
                                    </div>
                                    <div className="review-audio">
                                        <audio ref={audioRef} src={audio} controls></audio>
                                    </div>
                                </div>
                                <Button type="primary" disabled={save} loading={save} onClick={saveVioceFN}>
                                    <CloudUploadOutlined />
                                    Save Voice</Button>
                            </div>
                        </div>
                        <div className="custom-bg">
                            <p>Custom Background</p>
                            <div className="upload-bg">
                                <img src={state.account.bgimage_url ? state.account.bgimage_url : require('../../assets/images/test_bg.png')} alt="" />
                                <input type="file" accept="image/*" onChange={selectCustomBack}/>
                                <div className="edit-mask">
                                    <EditOutlined />
                                </div>
                                {custom && <div className="wait-up">
                                    <Spin/>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <p>
                        <Button type="primary" onClick={submitSave} loading={wait} disabled={wait}>SAVE</Button>
                    </p>
                </div>
                <div className="mobile-save">
                    <Button type="primary" size="large" onClick={submitSave} loading={wait} disabled={wait}>Save</Button>
                </div>
            </div>
            <ConnectModal/>
        </div>
    )
};

export default ProfileView;