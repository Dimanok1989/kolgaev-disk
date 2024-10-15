import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "semantic-ui-react";

export function toTime(sec = 0) {
    let date = new Date(1970, 0, 0, 0, 0, +sec || 0);
    let time = date.toLocaleTimeString('ru');
    if (sec < 3600) {
        return time.split(":").splice(1).join(":");
    }
    return time;
}

let timeOutHide = null;
let timeOutPlay = null;

const Video = props => {

    const { id, videoUrl, videoType, length, title } = props;

    const player = useRef();
    const video = useRef();
    const control = useRef();
    const canvasBuffered = useRef();
    const { postJson } = useFetch();

    const params = useSearchParams();
    const t = +params.get('t');
    const router = useRouter();

    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [hover, setHover] = useState(false);

    const [fullScreen, setFullScreen] = useState(false);
    const [show, setShow] = useState(true);

    const [volume, setVolume] = useState(localStorage.getItem('audio_volume') || 1);
    const [afterMuted, setAfterMudet] = useState(localStorage.getItem('audio_volume') || 0);
    const [volumeIcon, setVolumeIcon] = useState('volume up');
    const [mute, setMute] = useState(false);
    const [buffered, setBuffered] = useState([]);

    const [seconds, setSeconds] = useState(null);
    const [toSent, setToSent] = useState(false);

    const progress = length > 0 ? (currentTime * 100 / length) : 0;

    const setCurrentTimeCallback = useCallback((time) => {
        setSeconds(Math.round(time % 20));
        setCurrentTime(time);
    }, [video]);

    const sendTimeView = useCallback((time, viewed, cb) => {
        postJson(`disk/video/${id}/set-time`, { time, viewed }, cb)
    }, []);

    useEffect(() => {
        if (seconds === 20 && !toSent) {
            setToSent(true);
            sendTimeView(currentTime, false, () => setToSent(false));
            router.replace(`/video/${id}?t=${Math.round(currentTime)}`);
        }
    }, [seconds]);

    useEffect(() => {
        // video.current && video.current.addEventListener("canplaythrough", (event) => {
        //     video.current && video.current.play();
        // });

        video.current && video.current.addEventListener("ended", (event) => {
            sendTimeView(length, true, () => setToSent(false));
            // video.current.load();
            pause();
            setPaused(true);
        });
        video.current && video.current.addEventListener("timeupdate", (event) => {
            typeof event?.target?.currentTime == "number" && setCurrentTimeCallback(event.target.currentTime);
        });

        if (t > 0) {
            video.current.currentTime = t;
        }

        // player.onerror = e => {

        //     let message = "";

        //     if (player.error.message !== "")
        //         message = player.error.message;
        //     else if (player.error.code === 1)
        //         message = "Извлечение связанного ресурса было прервано запросом пользователя";
        //     else if (player.error.code === 2)
        //         message = "Произошла какая-то сетевая ошибка, которая помешала успешному извлечению носителя, несмотря на то, что он был ранее доступен";
        //     else if (player.error.code === 3)
        //         message = "Несмотря на то, что ранее ресурс был определён, как используемый, при попытке декодировать медиаресурс произошла ошибка";
        //     else if (player.error.code === 4)
        //         message = "Связанный объект ресурса или поставщика мультимедиа был признан неподходящим";
        //     else
        //         message = "Неизвестная ошибка";

        //     setLoadingMain(false);
        //     setError(message);
        // }
    }, [video]);

    const play = useCallback(() => {
        video.current && setPaused(false);
        video.current && video.current.play();
    }, [video]);

    const pause = useCallback(() => {
        video.current && setPaused(true);
        video.current && video.current.pause();
    }, [video]);

    const handlePlay = useCallback(() => {
        if (video.current) {
            setLoaded(true);
            paused && play();
            !paused && pause();
        }
    }, [video, paused]);

    const blockMouseMove = e => {
        control.current.style.opacity = 1;
        setShow(true);
        timeOutHide && clearTimeout(timeOutHide);
        timeOutPlay && clearTimeout(timeOutPlay);
        if (!paused) {
            timeOutHide = setTimeout(() => {
                setShow(false);
                if (control.current) control.current.style.opacity = 0;
            }, 2500);
        }
    }

    const rewind = useCallback((e) => {
        let bar = e.target;
        let offset = bar.getBoundingClientRect().x;
        let percent = ((e.pageX - bar.offsetLeft - offset) / bar.offsetWidth) * 100;
        video.current.currentTime = (length * percent) / 100;
    }, [video]);

    const toggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) {
            player.current
                .requestFullscreen()
                .then(() => {
                    setFullScreen(true);
                })
                .catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
        }
        else {
            document.exitFullscreen();
            setFullScreen(false);
        }
    }, [video]);

    const muted = useCallback(() => {
        if (!mute) {
            video.current.volume = 0;
        } else if (afterMuted === 0) {
            video.current.volume = 1;
        } else {
            video.current.volume = afterMuted;
        }
        setVolume(video.current.volume);
        setMute(!mute);
    }, [volume, video]);

    const drawProgress = useCallback(() => {
        const canvas = canvasBuffered.current;
        if (!canvas) {
            return;
        }
        let context = canvas.getContext('2d', { antialias: false });
        context.fillStyle = '#2563eb';
        let width = canvas.width;
        let height = canvas.height;
        if (!width || !height) {
            return;
        }
        context.clearRect(0, 0, width, height);
        buffered.forEach(buff => {
            let leadingEdge = buff.start / length * width;
            let trailingEdge = buff.end / length * width;
            context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height);
        });
    }, [buffered, canvasBuffered, length]);

    useEffect(() => {
        if (buffered.length) {
            drawProgress();
        }
    }, [buffered, canvasBuffered, length]);

    useEffect(() => {
        if (video.current) {
            if (video.current.volume <= 0.01) {
                setVolumeIcon("volume off");
            } else if (video.current.volume < 0.7) {
                setVolumeIcon("volume down");
            } else {
                setVolumeIcon("volume up");
            }
            video.current.volume = volume;
            localStorage.setItem('audio_volume', volume);
        }
    }, [volume, video]);



    return <div
        className={`relative bg-black rounded-lg overflow-hidden ${fullScreen ? 'flex items-center' : ''}`}
        onMouseMove={blockMouseMove}
        ref={player}
    >

        <div className={`absolute inset-0 text-white flex items-center justify-center`}>
            {!paused && <Icon name="play" fitted size="massive" className={`${!loaded ? '!hidden' : 'player-flash-status'}`} />}
            {paused && <Icon name="pause" fitted size="massive" className={`${!loaded ? '!hidden' : 'player-flash-status'}`} />}
        </div>

        <video
            id={id}
            controls={false}
            width="100%"
            height={fullScreen ? "100%" : null}
            crossOrigin="anonymous"
            onCanPlay={(e) => {
                var promise = e.target.play();
                if (promise !== undefined) {
                    promise.then(_ => {
                        play();
                    }).catch(error => {
                        // Autoplay was prevented.
                        // Show a "Play" button so that user can start playback.
                    });
                }
            }}
            onContextMenu={e => e.preventDefault()}
            onProgress={e => {

                let buffered = e?.target?.buffered;
                let periods = [];

                for (let i = 0; i < buffered.length; i++) {
                    periods.push({
                        start: buffered.start(i),
                        end: buffered.end(i),
                    });
                }

                setBuffered(periods);
            }}
            ref={video}
        >
            <source
                src={videoUrl}
                type={videoType}
            />
        </video>

        <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={handlePlay}
            onDoubleClick={toggleFullScreen}
        >
            {/* {paused && <div
                className="bg-white px-5 py-2 rounded-xl opacity-70 cursor-pointer hover:opacity-100 shadow"
                onClick={play}
            >
                <Icon name="play" fitted size="big" color="red" />
            </div>} */}
        </div>

        {fullScreen && <div
            className={`absolute top-0 left-0 right-0 bg-black/30 text-white px-3 py-4 ${show ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: "0.3s" }}
        >
            <h3>{title}</h3>
        </div>}

        <div
            className="absolute bottom-0 left-0 right-0 bg-black/30 text-white"
            style={{ transition: "0.3s" }}
            ref={control}
        >
            <div
                className="mx-2 bg-gray-500/40 relative rounded-sm overflow-hidden"
                style={{ height: 5, transform: hover ? "scaleY(1.3)" : null }}
            >
                <canvas width="1280" height="5" className="video-buffered !z-10" ref={canvasBuffered} />
                <div
                    className={`h-full !z-20 opacity-100 progress-video-bar`}
                    style={{ width: `${progress}%`, transition: "0.1s" }}
                />
                <div
                    className="w-full h-[11px] absolute top-[-3px] cursor-pointer z-10"
                    onClick={rewind}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                />
            </div>
            <div className="flex px-5 py-3 items-center">
                <div className="flex gap-6 items-center grow">
                    <span>
                        <Icon
                            name={paused ? "play" : "pause"}
                            fitted
                            link
                            size="large"
                            onClick={handlePlay}
                        />
                    </span>
                    <span>
                        {toTime(length)} / {toTime(currentTime)}
                    </span>
                </div>
                <div className="flex gap-6 items-center">
                    <div className="flex items-center w-[80px]">
                        <input
                            type="range"
                            max={1}
                            min={0}
                            step={0.01}
                            className="slider-volume"
                            value={volume}
                            onChange={e => {
                                setVolume(e.currentTarget.value);
                                setAfterMudet(e.currentTarget.value);
                            }}
                        />
                    </div>
                    <span className="flex items-center w-[24px]" onClick={muted}>
                        <Icon
                            name={volumeIcon}
                            fitted
                            link
                            size="large"
                        />
                    </span>
                    <span>
                        <Icon
                            name={fullScreen ? "compress" : "expand"}
                            fitted
                            link
                            size="large"
                            onClick={toggleFullScreen}
                        />
                    </span>
                </div>
            </div>
        </div>

    </div>
}

export default Video;