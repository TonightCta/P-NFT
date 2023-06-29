import { useRef, useState } from "react";

export const useMediaRecorder = () => {
    const [mediaUrl, setMediaUrl] = useState<string>('');
    const [audioFile, setAudioFile] = useState<File | Blob>();
    const mediaStream = useRef<MediaStream>();
    const mediaRecorder = useRef<MediaRecorder>();
    const mediaBlobs = useRef<Blob[]>([]);
    const startRecord = async () => {
        setMediaUrl('');
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        mediaRecorder.current = new MediaRecorder(mediaStream.current);
        mediaRecorder.current.ondataavailable = (blobEvent) => { mediaBlobs.current.push(blobEvent.data); }
        mediaRecorder.current.onstop = () => {
            const blob = new Blob(mediaBlobs.current, { type: 'audio/wav' })
            const url = URL.createObjectURL(blob); 
            setAudioFile(blob)
            setMediaUrl(url);
        }
        mediaRecorder.current?.start();
    }
    const pauseRecord = async () => {
        mediaRecorder.current?.pause();
    }
    const resumeRecord = async () => {
        mediaRecorder.current?.resume()
    }
    const stopRecord = async () => {
        mediaRecorder.current?.stop()
        mediaStream.current?.getTracks().forEach((track) => track.stop());
        mediaBlobs.current = [];
    }
    return {
        audioFile,
        mediaUrl,
        startRecord,
        pauseRecord,
        resumeRecord,
        stopRecord,
    }
};
