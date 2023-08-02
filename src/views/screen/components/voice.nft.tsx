import { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Sketch from "../tool/sketch";

const VoiceNFTWapper = (): ReactElement<ReactNode> => {
    const [canvasEle, setCanvasEle]: Array<any> = useState(null);
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
    const [sayer, setSayer] = useState({ name: '', voice: '' });
    const toggleAudio = (trigger: boolean, audio: any) => {
        if (trigger) {
            audio && audio.play()
            // canvas && canvas.play()
        } else {
            audio && audio.pause()
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
        [canvasEle, loading, activeIndex]
    )
    useEffect(() => {
        const rel = document.getElementById('container')
        if (rel && !canvasEle?.container) {
            const ele = new Sketch({
                dom: document.getElementById('container'),
            })
            // ele.stop()
            setCanvasEle(ele)
        }
    }, [])
    return (
        <div className="voice-nft-wapper public-screen">
            <section className="canvas-box" id="container">
            
            </section>
            <div className="player-list">
                <div className={`list-inner ${loading ? 'load-player' : ''}`}>
                    <audio ref={refVoice} autoPlay={false} loop preload="auto" src={sayer.voice} />
                    {ds_avatar.map((item, i) => (
                        <img
                            key={item.id}
                            src={item.src}
                            alt=""
                            onClick={() => {
                                playVoice(item)
                            }}
                            style={{
                                border: i === activeIndex ? '2px solid #f3398d' : 'none',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
};

export default VoiceNFTWapper;