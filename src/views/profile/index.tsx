import { ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { CloudUploadOutlined } from '@ant-design/icons'
import * as API from '../../request/api'
import './index.scss'
import { PNft } from "../../App";
import IconFont from "../../utils/icon";
import { Button, Spin, message } from "antd";
import { Type } from "../../utils/types";
import axios from "axios";
import MaskCard from "../../components/mask";
import { useMediaRecorder } from "../../hooks/record";
import Recording from "../voice.nft/components/recording";
import DefaultAvatar from "../../components/default_avatar/default.avatar";
import MaskElement from "../voice.nft/components/mask.element";
import { VERSION } from "../../utils/source";
import FooterNew from "../screen.new/components/footer.new";

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
    const [custom, setCustom] = useState<boolean>(false);
    const [record, setRecord] = useState<boolean>(false);
    const { audioFile, mediaUrl, startRecord, stopRecord } = useMediaRecorder();
    const [audio, setAudio] = useState<string>('');
    const audioRef: any = useRef('');
    const fileRef: any = useRef('');
    const fileBgRef: any = useRef('');
    const [upAvatar, setUpAvatar] = useState<boolean>(false);
    const upDateAccount = async () => {
        const account = await API.ProfileService({
            user_address: state.address
        });
        const setAvatar = async () => {
            const result = await API.QueryFile({
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            return
        }
        if (!profile.bio) {
            setError({
                ...error,
                bio: true
            });
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            return
        }
        if (!profile.email_address) {
            setError({
                ...error,
                email: true
            });
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            return
        }
        if (!check.test(profile.email_address)) {
            setError({
                ...error,
                email: true
            });
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            return
        }
        if (!profile.links) {
            setError({
                ...error,
                link: true
            });
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
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
        const result: any = await API.EditProfileService(params);
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
        const file = e.target.files[0];
        const fileSize = file.size / (1024 * 1024);
        if (fileSize > 1) {
            message.warning('The maximum file size is 1MB.');
            setUpAvatar(false);
            return
        }
        formdata.append('user_address', state.address as string);
        formdata.append('avatar', file);
        const result: any = await API.EditAvatarService(formdata);
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
        const result = await API.AuthTwitterService({
            chain_id: state.chain,
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
        const result = await API.UploadAudioService(formdata);
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
    const selectCustomBack = async (e: any) => {
        setCustom(true);
        const formdata = new FormData();
        const file = e.target.files[0];
        const fileSize = file.size / (1024 * 1024);
        if (fileSize > 5) {
            message.warning('The maximum file size is 5MB.');
            return
        }
        formdata.append('user_address', state.address as string);
        formdata.append('bgimg', file);
        const result = await API.UploadBackGroundService(formdata);
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
        <div className={`profile-view ${VERSION === 'new' ? 'profile-view-new' : ''}`}>
            {VERSION === 'old' && <MaskCard />}
            <div className="up-mask">
                <div className="setting-content">
                    {VERSION === 'new' && <p className="profile-name-new">Profile</p>}
                    <div className="new-setting-inner">
                        {VERSION === 'new' && <div className="new-set-avatar">
                            <div className="avatar-inner">
                                {state.account.avatar_url ? <img src={state.account.avatar_url} alt="" /> : <DefaultAvatar diameter={162} />}
                                <input type="file" title="Select File" ref={fileRef} accept="image/*" onChange={selectAvatar} />
                                {
                                    upAvatar && <div className="loading-up">
                                        <Spin />
                                    </div>
                                }
                            </div>
                            <div className="edit-btn" onClick={() => {
                                fileRef.current.click();
                            }}>
                                <IconFont type="icon-pencil-simple-line-bold" />
                            </div>
                        </div>}
                        <div>
                            <div className="edit-msg">
                                {VERSION === 'old' && <p className="profile-name">Profile</p>}
                                {VERSION === 'old' && <div className="avatar-box">
                                    <p>Profile Image</p>
                                    <div className="up-box">
                                        <div className="img-box">
                                            {state.account.avatar_url ? <img src={state.account.avatar_url} alt="" /> : <DefaultAvatar diameter={192} />}
                                            <div className="edit-btn">
                                                <input type="file" title="Select File" ref={fileRef} accept="image/*" onChange={selectAvatar} />
                                            </div>
                                            {
                                                upAvatar && <div className="loading-up">
                                                    <Spin />
                                                </div>
                                            }
                                        </div>
                                        <Button type="default" onClick={() => {
                                            fileRef.current.click();
                                        }}>
                                            <IconFont type="icon-pencil-simple-line-bold" />
                                            Upload Image
                                        </Button>
                                    </div>
                                </div>}
                                <div className="inp-set">
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
                                </div>
                                <div className="public-inp n-top">
                                    <p className="inp-label">Wallet Address</p>
                                    <input type="text" placeholder="Wallet Address" value={state.address as string} readOnly />
                                </div>
                                <div className="outside-account">
                                    <p>Social Connections</p>
                                    <p className="outside-remark">Help collectors verify your account by connecting social accounts</p>
                                    <ul>
                                        <li onClick={() => {
                                            !state.account.auth_twitter && bindTwitterFN()
                                        }}>
                                            <div className={`icon-box ${state.account.auth_twitter ? 'has-bind' : ''}`}>
                                                <IconFont type="icon-twitter-logo-bold" />
                                            </div>
                                            <p>{state.account.auth_twitter ? 'Connected' : 'Connect'}</p>
                                            {state.account.auth_twitter && <div className="has-bind-tag">
                                                <IconFont type="icon-check-bold" />
                                            </div>}
                                        </li>
                                        <li>
                                            <div className="icon-box">
                                                <IconFont type="icon-discord-logo-bold" onClick={() => {
                                                    message.info('Under Construction');
                                                }} />
                                            </div>
                                            <p>Connect</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="edit-save">
                                <div className="voice-remark">
                                    <p className="public-edit-title">Voice Introduction</p>
                                    <p className="title-remark">Click button to start Recording</p>
                                    <div className="record-box">
                                        <div className="record-btn">
                                            <div className="btn-start" onClick={() => {
                                                setRecord(record ? false : true)
                                                !record ? startRecord() : stopRecord()
                                            }}>
                                                {!record ? <img src={require(`../../assets/images/record_icon${VERSION === 'new' ? '_new' : ''}.png`)} alt="" />
                                                    : <Recording />}
                                            </div>

                                        </div>
                                        <div className="review-audio">
                                            <audio ref={audioRef} src={audio} controls></audio>
                                        </div>
                                        <Button type="primary" disabled={save} loading={save} onClick={saveVioceFN}>
                                            <CloudUploadOutlined />
                                            Save Voice</Button>
                                    </div>
                                </div>
                                <div className="custom-bg">
                                    <p className="public-edit-title">Custom Background</p>
                                    <div className="upload-bg">
                                        <img src={state.account.bgimage_url ? state.account.bgimage_url : require('../../assets/images/test_bg.png')} alt="" />
                                        <input ref={fileBgRef} type="file" accept="image/*" onChange={selectCustomBack} />
                                        {custom && <div className="wait-up">
                                            <Spin />
                                        </div>}
                                        <div className="upload-btn" onClick={() => {
                                            fileBgRef.current.click()
                                        }}>
                                            <IconFont type="icon-pencil-simple-line-bold" />
                                            {VERSION === 'old' && <p>Upload image</p>}
                                        </div>
                                    </div>
                                </div>
                                <p className="submit-all">
                                    <Button type="primary" onClick={submitSave} loading={wait} disabled={wait}>
                                        { VERSION === 'old' ? 'SAVE' : 'Save Profile' }
                                    </Button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {VERSION === 'new' && <FooterNew/>}
            {VERSION === 'old' && <MaskElement />}
        </div>
    )
};

export default ProfileView;