import { ReactElement, ReactNode, useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import IconFont from "../../../utils/icon";
// import Sketch from "../tool/sketch";

const VoiceNFTWapper = (): ReactElement<ReactNode> => {
    // const [canvasEle, setCanvasEle]: Array<any> = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState(999)
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
    const [play,setPlay] = useState<boolean>(false);
    const [sayer, setSayer] = useState({ name: '', voice: '' });
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
    const playVoice = useCallback(
        (item: any) => {
            if (loading) return
            setActiveIndex(item.id)
            const audioEle: any = refVoice.current
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
    )
    // useEffect(() => {
    //     const rel = document.getElementById('container')
    //     if (rel && !canvasEle?.container) {
    //         const ele = new Sketch({
    //             dom: document.getElementById('container'),
    //         })
    //         // ele.stop()
    //         setCanvasEle(ele)
    //     }
    // }, [])
    return (
        <div className="voice-nft-wapper public-screen">
            <p className="public-title">
                TRAFFIC OF<br />VOICENFT
            </p>
            <audio ref={refVoice} autoPlay={false} loop preload="auto" src={sayer.voice} />
            <Swiper
                slidesPerView={5}
                spaceBetween={30}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                loop
                className="swiper-4"
            >
                <div className="right-mask mask-public"></div>
                {
                    ds_avatar.map((item, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <img className="bg-img" src={item.src} alt="" />
                                <div className="inner-msg">
                                    <div className="avatar-box">
                                        <div className="avatar-inner" onClick={() => {
                                            playVoice(item)
                                        }}>
                                            {sayer.name === item.name && play ? <IconFont type="icon-zanting1"/> : <IconFont type="icon-bofang_play-one" />}
                                            <img src={item.src} alt="" />
                                        </div>
                                    </div>
                                    <p>{item.name}</p>
                                    <p>Business Development</p>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
};

export default VoiceNFTWapper;