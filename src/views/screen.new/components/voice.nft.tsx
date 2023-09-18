import { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Company, CompanyList } from "../../../utils/source";
import IconFont from "../../../utils/icon";


const VoiceNftNew = (): ReactElement<ReactNode> => {
    const voiceSrc = [
        'ANGELINA_JOLIE',
        'Bill_Gates',
        'Cathie_Wood',
        'Cliff_Richard',
        'CZ',
        'Elon_Musk',
        'John_McAfee',
        'Justin_Sun',
        'Kobe_Bryant',
        'LADY_GAGA',
        'LEONARDO_DICAPRIO',
        'Sam_Bankman_Fried',
        'Sheldon',
        'Simba',
        'Taylor_Swift',
        'Violet',
        'Vitalik',
    ]
    const ds_avatar = voiceSrc.map((e, i) => ({
        id: i,
        name: e.replace(/_/g, ' '),
        voice: `/audios/voice_${e}.mp3`,
        src: `/audios/avatar/${e}.jpg`,
        // src: `https://randomuser.me/api/portraits/lego/${(i + 1) % 8}.jpg`,
    }));
    const refVoice: any = useRef()
    const [loading, setLoading] = useState<boolean>(false);
    const [play, setPlay] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState(999);
    const [sayer, setSayer] = useState({ name: '', voice: '' });
    const [movingBg, setMovingBg] = useState<string>('white');
    const toggleAudio = (trigger: boolean, audio: any) => {
        if (trigger) {
            audio && audio.play()
            setPlay(true)
            // canvas && canvas.play()
        } else {
            audio && audio.pause()
            setPlay(false)
            // canvas && canvas.stop()
        }
    }
    const onScrollVoice = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollTop >= 3800) {
            setMovingBg('rgba(32,36,42,0.2)');
        } else {
            setMovingBg('white');
        }
        if (scrollTop >= 3900) {
            setMovingBg('rgba(32,36,42,0.4)');
        }
        if (scrollTop >= 4000) {
            setMovingBg('rgba(32,36,42,0.6)');
        }
        if (scrollTop >= 4100) {
            setMovingBg('rgba(32,36,42,0.8)');
        }
        if (scrollTop >= 4200) {
            setMovingBg('rgba(32,36,42,1)');
        }
        if (scrollTop >= 4700) {
            setMovingBg('rgba(32,36,42,0.8)');
        }
        if (scrollTop >= 4800) {
            setMovingBg('rgba(32,36,42,0.8)');
        }
        if (scrollTop >= 4900) {
            setMovingBg('rgba(32,36,42,0.6)');
        }
        if (scrollTop >= 5000) {
            setMovingBg('rgba(32,36,42,0.4)');
        }
        if (scrollTop >= 5100) {
            setMovingBg('rgba(32,36,42,0.2)');
        }
        if (scrollTop >= 5200) {
            setMovingBg('white');
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', onScrollVoice, false);
        return () => {
            window.removeEventListener('scroll', onScrollVoice, false);
        }
    }, [])
    const playVoice = useCallback(
        (item: any) => {
            if (loading) return
            setActiveIndex(item.id)
            const audioEle: any = refVoice.current;
            if (audioEle && sayer.voice && item.id === activeIndex) {
                toggleAudio(audioEle.paused, audioEle)
            } else {
                setLoading(true)
                toggleAudio(false, audioEle)
                setSayer(item)
                audioEle.src = item.src
                audioEle.load()
                setTimeout(() => {
                    const playPromise = audioEle.play()
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                toggleAudio(true, null)
                            })
                            .catch((error: any) => {
                                toggleAudio(false, null)
                            })
                            .finally(() => {
                                setLoading(false)
                            })
                    } else {
                        setLoading(false)
                        toggleAudio(false, null)
                    }
                }, 1000)
            }
        },
        [loading, activeIndex]
    );
    return (
        <div className="voice-nft-new" style={{ background: movingBg }}>
            <audio ref={refVoice} autoPlay={false} loop preload="auto" src={sayer.voice} />
            <p className="voice-title public-title">
                Traffic of <span>VoiceNFT</span>
            </p>
            <div className="figure-box">
                <div className="box-inner">
                    <ul>
                        {
                            ds_avatar.slice(0, Math.floor(ds_avatar.length / 2)).map((item, index) => {
                                return (
                                    <li key={index} onClick={() => {
                                        playVoice(item)
                                    }}>
                                        <img src={item.src} alt="" />
                                        <p>{item.name}</p>
                                        <div className="play-btn">
                                            {sayer.name === item.name && play ? <IconFont type="icon-zanting_pause" /> : <IconFont type="icon-bofang_play-one" />}
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul>
                        {
                            ds_avatar.slice(Math.floor(ds_avatar.length / 2), ds_avatar.length).map((item, index) => {
                                return (
                                    <li key={index} onClick={() => {
                                        playVoice(item)
                                    }}>
                                        <img src={item.src} alt="" />
                                        <p>{item.name}</p>
                                        <div className="play-btn">
                                            {sayer.name === item.name && play ? <IconFont type="icon-zanting_pause" /> : <IconFont type="icon-bofang_play-one" />}
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            {/* <div className="company-box">
                <ul>
                    {
                        CompanyList.map((item: Company, index: number) => {
                            return (
                                <li key={index}>
                                    <img src={item.logo} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </div> */}
            <div className="ribbon-box">
                <ul>
                    {
                        CompanyList.map((item: Company, index: number) => {
                            return (
                                <li key={index}>
                                    {/* <IconFont type="icon-zixing" /> */}
                                    <img src={item.logo} alt="" />
                                    {/* <p>Pizzap AI Empowers Your Creative Inspiration</p> */}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
};

export default VoiceNftNew;