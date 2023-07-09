import { ReactElement, ReactNode, useContext, useState } from "react";
import { EditOutlined } from '@ant-design/icons'
import { ProfileService, EditAvatarService, EditProfileService, QueryFile } from "../../request/api";
import './index.scss'
import { PNft } from "../../App";
import { calsAddress } from "../../utils";
import IconFont from "../../utils/icon";
import { Button, InputProps, Spin, message } from "antd";
import { Type } from "../../utils/types";

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
    }
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
        upDateAccount()
    };
    const selectAvatar = async (e: any) => {
        console.log(e.target.files[0]);
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
    }
    return (
        <div className="profile-view">
            <div className="edit-msg">
                <p className="profile-name">Profile</p>
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
                            <IconFont type="icon-tuitetwitter43" />
                        </li>
                        <li>
                            <IconFont type="icon-discord" />
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
                        <img src={state.avatar ? state.avatar : require('../../assets/images/WechatIMG20.jpeg')} alt="" />
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
                <p>
                    <Button type="primary" onClick={submitSave} loading={wait} disabled={wait}>SAVE</Button>
                </p>
            </div>
        </div>
    )
};

export default ProfileView;