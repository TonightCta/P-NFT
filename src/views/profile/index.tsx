import { ReactElement, ReactNode } from "react";
import { EditOutlined } from '@ant-design/icons'
import './index.scss'

const ProfileView = (): ReactElement<ReactNode> => {
    return (
        <div className="profile-view">
            <div className="edit-msg">
                <p className="profile-name">Profile</p>
                <div className="public-inp">
                    <p className="inp-label">Username</p>
                    <input type="text" placeholder="Username" />
                </div>
                <div className="public-inp">
                    <p className="inp-label">Bio</p>
                    <input type="text" placeholder="Bio" />
                </div>
                <div className="public-inp">
                    <p className="inp-label">Email Address</p>
                    <input type="text" placeholder="Email address" />
                </div>
                <div className="outside-account">
                    <p>Social Connections</p>
                    <p className="outside-remark">Help collectors verify your account by connecting social accounts</p>
                    <ul>
                        <li>
                            <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </li>
                        <li>
                            <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </li>
                        <li>
                            <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                        </li>
                    </ul>
                </div>
                <div className="public-inp">
                    <p className="inp-label">Links</p>
                    <input type="text" placeholder="Links" />
                </div>
                <div className="public-inp">
                    <p className="inp-label">Wallet Address</p>
                    <input type="text" placeholder="Wallet Address" />
                </div>
            </div>
            <div className="edit-save">
                <div className="avatar-box">
                    <p>Profile Image</p>
                    <div className="img-box">
                        <img src={require('../../assets/images/WechatIMG20.jpeg')} alt="" />
                        <div className="edit-btn">
                            <EditOutlined />
                        </div>
                    </div>
                </div>
                <p>
                    <button>SAVE</button>
                </p>
            </div>
        </div>
    )
};

export default ProfileView;