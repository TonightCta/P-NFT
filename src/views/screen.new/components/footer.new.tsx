import { ReactElement, ReactNode } from "react";
import IconFont from "../../../utils/icon";

interface Account {
  icon: string;
  url: string;
}

const SideList: Account[] = [
  {
    icon: "icon-github",
    url: "https://github.com/Pizzap-io",
  },
  {
    icon: "icon-telegram1",
    url: "http://t.me/pizzap_io",
  },
  {
    icon: "icon-twitter",
    url: "https://twitter.com/pizzap_io",
  },
  {
    icon: "icon-medium1",
    url: "https://medium.com/@Pizzap_io",
  },
  {
    icon: "icon-discord1",
    url: "http://discord.gg/eATngqtx3m",
  },
];

const FooterNew = (): ReactElement<ReactNode> => {
  return (
    <div className="footer-wapper-new">
      <img src={require("../../../assets/images/logo.new.png")} alt="" />
      <p>© 2024 by Meme Hackathon. All rights reserved!</p>
      <ul>
        {SideList.map((item: Account, index: number) => {
          return (
            <li
              key={index}
              onClick={() => {
                window.open(item.url);
              }}
            >
              <IconFont type={item.icon} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterNew;
