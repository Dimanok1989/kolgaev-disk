import useFetch from "@/hooks/useFetch";
import { useResize } from "@/hooks/useResize";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, Icon } from "semantic-ui-react";
import { ProgressSpinner } from 'primereact/progressspinner';

export function toTime(sec = 0, toArray = false) {
    let date = new Date(1970, 0, 0, 0, 0, +sec || 0);
    let time = date.toLocaleTimeString('ru');
    if (sec < 3600) {
        return time.split(":").splice(1).join(":");
    }
    if (toArray) {
        return time.split(":");
    }
    return time;
}

let timeOutHide = null;
let timeOutPlay = null;

const Video = props => {

    const { id, title } = props;

    const player = useRef();
    const video = useRef();
    const source = useRef();
    const control = useRef();
    const canvasBuffered = useRef();
    const { postJson } = useFetch();
    const [files, setFiles] = useState(props?.files || []);

    const params = useSearchParams();
    const t = +params.get('t');
    const router = useRouter();

    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [length, setLength] = useState(props.length || 0);
    const [loadingVideo, setLoadingVideo] = useState(true);

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

    const [format, setFormat] = useState(localStorage.getItem('video-format'));
    const [currentFile, setCurrentFile] = useState({});

    useEffect(() => {
        if (files.length > 0) {

            let file = files.find(e => e.format === format);

            if (!file) {
                let general = String(String(format).split("p")[0]) + "p";
                setFormat(general);
                file = files.find(e => e.format === general);
            }

            if (!file) {
                file = files[files.length - 1];
            }

            source.current.src = file?.url;
            source.current.type = file?.mimeType;
            video.current.load();

            setCurrentFile(file);
        }
    }, []);

    const changeFormat = useCallback((key, file) => {

        localStorage.setItem('video-format', file.format);
        setFormat(file.format);
        setCurrentFile(file);

        let time = video.current.currentTime;
        source.current.src = files[key].url;
        source.current.type = files[key].mimeType;
        video.current.load();
        video.current.currentTime = time;
    }, [video, files]);

    useEffect(() => {
        if (seconds === 5 && !toSent && id) {
            setToSent(true);
            sendTimeView(currentTime, false, () => setToSent(false));
            router.replace(`/video/${id}?t=${Math.round(currentTime)}`, null, { scroll: false });
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

        video.current && video.current.addEventListener("loadeddata", (event) => {
            if (typeof video?.current?.duration == "number") {
                setLength(video.current.duration);
                setLoadingVideo(false);
            }
        });

        if (t > 0) {
            video.current.currentTime = t;
        }

        video.current && video.current.addEventListener("onerror", (event) => {
            console.log(event);
        });

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

    useEffect(() => {
        if (paused) {
            if (control.current) control.current.style.opacity = 1;
            setShow(true);
        }
    }, [paused]);

    const setCurrentTimeCallback = useCallback((time) => {
        setSeconds(Math.round(time % 5));
        setCurrentTime(time);
    }, [video]);

    const sendTimeView = useCallback((time, viewed, cb) => {
        id && postJson(`disk/video/${id}/set-time`, { time, viewed }, cb)
    }, []);

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

    const windowWidth = useResize();
    const [height, setHeight] = useState('auto');

    useEffect(() => {
        if (player.current?.offsetWidth) {
            setHeight(player.current.offsetWidth * (9 / 16));
        }
    }, [windowWidth]);

    useEffect(() => {

        (id && window.Echo) && window.Echo.channel(`disk.video.${id}`)
            .listen('Tube\\DownloadProgressEvent', ({ data }) => {
                Boolean(data?.fullData?.files) && setFiles(data?.fullData?.files);
            });

        return () => {
            (id && window.Echo) && window.Echo.leaveChannel(`disk.video.${id}`);
        }
    }, [id]);

    return <div
        className={`relative bg-black flex items-center overflow-hidden ${fullScreen ? 'flex items-center' : ''}`}
        onMouseMove={blockMouseMove}
        ref={player}
        style={{ height }}
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
            style={{
                maxWidth: "100%",
                maxHeight: "100%",
            }}
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
            <source ref={source} /*src={videoUrl} type={videoType}*/ />
        </video>

        {loadingVideo && <div className="absolute flex justify-center w-full">
            <ProgressSpinner />
        </div>}

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
                            link={!loadingVideo}
                            size="large"
                            onClick={handlePlay}
                            disabled={loadingVideo}
                        />
                    </span>
                    <span className="cursor-default flex items-center gap-1 font-sans">
                        <span className="font-sans">{toTime(currentTime)}</span>
                        <span className="opacity-60 font-sans mb-[2px]">/</span>
                        <span className="opacity-60 font-sans">{toTime(length)}</span>
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
                            onClick={e => {
                                e.preventDefault();
                            }}
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
                    {files.length > 1 &&
                        <span className="relative">
                            <Dropdown
                                icon={<span className="opacity-80 hover:opacity-100 cursor-pointer" style={{ transition: "opacity .1s ease" }}>
                                    <Icon
                                        name="setting"
                                        fitted
                                        link
                                        size="large"
                                    />
                                    {currentFile && <strong className={`absolute -top-1 -right-2 bg-blue-600 px-1 rounded text-white cursor-default ${String(currentFile.format).indexOf("1080p") >= 0 ? 'bg-red-600' : ''} ${String(currentFile.format).indexOf("480p") >= 0 ? 'bg-yellow-600' : ''}`} style={{ fontSize: "8px", lineHeight: "12px" }}>
                                        {String(currentFile.format).indexOf("1080p") >= 0 && `HD`}
                                        {String(currentFile.format).indexOf("720p") >= 0 && `HD`}
                                        {String(currentFile.format).indexOf("480p") >= 0 && `SD`}
                                    </strong>}
                                </span>}
                                inline
                                upward
                                floating
                                direction="left"
                            >
                                <DropdownMenu>
                                    {files.map((file, key) => <DropdownItem
                                        key={key}
                                        text={file.format}
                                        selected={file.format === format}
                                        onClick={() => changeFormat(key, file)}
                                        description={file.isHd ? 'HD' : null}
                                        icon={<Icon
                                            name='circle'
                                            color={file.format === format ? 'green' : 'grey'}
                                            disabled={file.format !== format}
                                        />}
                                    />)}
                                </DropdownMenu>
                            </Dropdown>
                        </span>
                    }
                    <span>
                        <Icon
                            name={fullScreen ? "compress" : "expand"}
                            fitted
                            link={!loadingVideo}
                            size="large"
                            onClick={toggleFullScreen}
                            disabled={loadingVideo}
                        />
                    </span>
                </div>
            </div>
        </div>

    </div>
}

export default Video;