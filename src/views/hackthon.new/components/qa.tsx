import { ReactElement, useState } from "react";
import IconFont from "../../../utils/icon";
import { flag } from "../../../utils/source";

interface List {
  name: string;
  answer: string;
  hidden: boolean;
}

const Data: List[] = [
  {
    name: "What is $HACK?",
    answer:
      "$HACK is the initial token for launching hackathons on the Memehack platform. Each new round of the Meme Hackathon will issue a new kind of token under a different name.",
    hidden: flag ? true : false,
  },
  {
    name: "What is Memehack?",
    answer:
      "Memehack aims to provide a transparent and fair platform where all users can participate in the growth and appreciation of meme coins and benefit from it. All projects deployed through Memehack’s protocol are guaranteed to avoid centralized financial risks, providing users with a fast and cost-effective environment to create, trade, and circulate memecoins. All initiations, voting, and meme creations are spontaneously organized by platform users, with Memehack providing only technical support.",
    hidden: flag ? true : false,
  },
  {
    name: "Goals and Vision",
    answer:
      "Memehack aims to create a vibrant and healthy memecoin ecosystem by launching new rounds of memecoins through hackathons. By promoting community participation and transparent governance, the project seeks to establish a sustainable platform where everyone can find their place. In the next phase, hackathons will introduce deployment and marketing functions, allowing anyone to launch tokens through the protocol.",
    hidden: flag ? true : false,
  },
  {
    name: "What is AIGC+Meme?",
    answer:
      "Memehack offers AI tools to users for meme symbol creation, enabling even those without art skills to create their ideal meme images with AI assistance. Most users can automatically initiate a memecoin creation event, soliciting the latest meme symbols on Memehack and launching a Web3+AI hackathon. This means that community users with ideas for meme symbols, even without high-level artistic skills, can create meme images using Memehack’s AI tools.",
    hidden: flag ? true : false,
  },
  {
    name: "What is DeFi+Vote?",
    answer:
      "The hackathon evaluation process is conducted through staking tokens among community members. The staked tokens will form LP assets, adopting a DeFi model, and community members who participate in voting can also earn DeFi rewards. The first-place work in the hackathon will become the new meme symbol, and the members launching memecoins this round will launch the latest memecoins with the new meme symbol.",
    hidden: flag ? true : false,
  },
  {
    name: "How does Memehack ensure fairness, justice, and transparency?",
    answer:
      "It is an open-source contract.Anyone can initiate a refund or establish an LP.The formation of LP, revocation of permissions, refunds, and completion of token distribution are entirely controlled by the contract, ensuring that the process is transparent and fair for all participants.",
    hidden: flag ? true : false,
  },
];

const QACard = (): ReactElement => {
  const [data, setData] = useState<List[]>(Data);
  return (
    <div className="qa-card">
      <div className="title">
        <p>Q&A</p>
        <p className="line"></p>
      </div>
      <ul>
        {data.map(
          (
            item: List,
            index: number
          ) => {
            return (
              <li
                key={index}
                className={`${item.hidden ? "hidden-answer" : ""}`}
                onClick={() => {
                  const list = data.map((item:List,i:number) => {
                    return {
                        ...item,
                        hidden:index === i ? !item.hidden : item.hidden
                    }
                  })
                  setData(list);
                }}
              >
                <p>
                  {index + 1}.&nbsp;{item.name}
                  <span>
                    <IconFont type="icon-xiangxia" />
                  </span>
                </p>
                <p>{item.answer}</p>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

export default QACard;
