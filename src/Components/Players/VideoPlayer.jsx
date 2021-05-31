import React from 'react';

import './video-player.css';

import { Icon, Loader } from 'semantic-ui-react';
import { getTimer } from './AudioPlayerControl';

let timeOutHide;

function VideoPlayer(props) {

    const { url, fileInfo, setError } = props;
    const setLoadingMain = props.setLoading;

    const [player, setPlayer] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [canplay, setCanplay] = React.useState(false);
    const [played, setPlayed] = React.useState(false);
    const [fullScreen, setFullScreen] = React.useState(false);

    const videoControl = React.useRef(null);
    const videoTitle = React.useRef(null);

    const [block, setBlock] = React.useState(false);
    const progress = React.useRef(null);
    const buffered = React.useRef(null);
    const bar = React.useRef(null);
    const timer = React.useRef(null);

    const lastVolume = localStorage.getItem('audio_volume') || null;
    const [afterMuted, setAfterMudet] = React.useState(lastVolume || 0);
    const [volume, setVolume] = React.useState(lastVolume || 1);
    const [volumeIcon, setVolumeIcon] = React.useState('volume up');
    const [mute, setMute] = React.useState(false);

    const setTime = e => {

        let width = progress.current.offsetWidth,
            click = e.pageX - progress.current.getBoundingClientRect().left,
            percent = Number((click * 100) / width).toFixed(2),
            time = +Number(player.duration * percent / 100).toFixed(2);

        player.currentTime = time;
        bar.current.style.width = `${percent}%`;

    }

    const toggleFullscreen = () => {

        if (!document.fullscreenElement) {
            block.requestFullscreen().then(() => {
                setFullScreen(true);
                block.classList.add('full-screeen');
            }).catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        }
        else {
            document.exitFullscreen();
            setFullScreen(false);
            block.classList.remove('full-screeen');
        }

    }

    React.useEffect(() => {

        setPlayer(document.getElementById('video-player'));

    }, []);


    const blockMouseMove = e => {

        videoControl.current.style.opacity = 1;
        videoTitle.current.style.opacity = 1;
        player.style.cursor = "default";

        clearTimeout(timeOutHide);

        timeOutHide = setTimeout(() => {

            if (player)
                player.style.cursor = "none";

            if (videoControl.current)
                videoControl.current.style.opacity = 0;

            if (videoTitle.current)
                videoTitle.current.style.opacity = 0;

        }, 2500);

    }

    React.useEffect(() => {

        if (played && block) {
            block.onmousemove = blockMouseMove;
        }
        else if (block) {
            block.onmousemove = null;
            videoControl.current.style.opacity = 1;
            videoTitle.current.style.opacity = 1;
            player.style.cursor = "default";
            clearTimeout(timeOutHide);
        }

    }, [played])

    React.useEffect(() => {

        if (player) {

            setBlock(document.getElementById('video-block'));

            player.onloadedmetadata = e => {

                setLoadingMain(false);
                setLoading(false);

                bar.current.style.width = 0;
                timer.current.textContent = `${getTimer(player.currentTime, false)} / ${getTimer(player.duration, false)}`;

            }

            player.oncanplay = () => {
                setCanplay(true);
            }

            player.ontimeupdate = e => {

                if (bar.current)
                    bar.current.style.width = `${(player.currentTime * 100) / player.duration}%`;

                if (timer.current)
                    timer.current.textContent = `${getTimer(player.currentTime, false)} / ${getTimer(player.duration, false)}`;

            }

            const drawProgress = (canvas, buffered, duration) => {

                if (!canvas)
                    return null;

                let context = canvas.getContext('2d', { antialias: false });
                context.fillStyle = '#ffffff';

                let width = canvas.width;
                let height = canvas.height;

                if (!width || !height)
                    throw "Canvas's width or height weren't set!";

                context.clearRect(0, 0, width, height);

                for (let i = 0; i < buffered.length; i++) {
                    let leadingEdge = buffered.start(i) / duration * width;
                    let trailingEdge = buffered.end(i) / duration * width;
                    context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height);
                }

            }

            player.onprogress = e => {
                drawProgress(buffered.current, player.buffered, player.duration);
            }

            player.onplay = () => {
                setPlayed(true);
            }

            player.onpause = () => {
                setPlayed(false);
            }

            player.onended = () => {
                setPlayed(false);
                player.currentTime = 0;
                bar.current.style.width = 0;
            }

            player.onerror = e => {

                let message = "";

                if (player.error.message !== "")
                    message = player.error.message;
                else if (player.error.code === 1)
                    message = "Извлечение связанного ресурса было прервано запросом пользователя";
                else if (player.error.code === 2)
                    message = "Произошла какая-то сетевая ошибка, которая помешала успешному извлечению носителя, несмотря на то, что он был ранее доступен";
                else if (player.error.code === 3)
                    message = "Несмотря на то, что ранее ресурс был определён, как используемый, при попытке декодировать медиаресурс произошла ошибка";
                else if (player.error.code === 4)
                    message = "Связанный объект ресурса или поставщика мультимедиа был признан неподходящим";
                else
                    message = "Неизвестная ошибка";

                setLoadingMain(false);
                setError(message);

            }

            player.volume = lastVolume;

        }

    }, [player]);

    React.useEffect(() => {

        if (player) {

            if (player.volume <= 0.01)
                setVolumeIcon("volume off");
            else if (player.volume < 0.7)
                setVolumeIcon("volume down");
            else
                setVolumeIcon("volume up");

            localStorage.setItem('audio_volume', volume);

        }

    }, [volume, player]);

    const muted = () => {

        if (!mute)
            player.volume = 0;
        else if (afterMuted === 0)
            player.volume = 1;
        else
            player.volume = afterMuted;

        setVolume(player.volume);
        setMute(!mute);

    }

    return <div className="video-player-content">

        <div className="video-player" id="video-block">

            <video
                id="video-player"
                src={url}
                onClick={() => !played ? player.play() : player.pause()}
                onDoubleClick={toggleFullscreen}
            />

            {!played && !loading
                ? <div className="big-play-button" onClick={() => player.play()}>
                    <Icon name="play" size="huge" />
                </div>
                : null
            }

            <div className="video-title" style={{ display: loading ? "none" : "block" }} ref={videoTitle}>
                <h5>{fileInfo.name}</h5>
            </div>

            <div className="video-control" style={{ display: loading ? "none" : "block" }} ref={videoControl}>

                <div className="video-timeline" ref={progress} onClick={setTime}>
                    <canvas className="video-buffered" ref={buffered}></canvas>
                    <div className="video-progress-bar" ref={bar}></div>
                </div>

                <div className="video-control-buttons">

                    <div>
                        <span>{canplay
                            ? <Icon name={!played ? "play" : "pause"} className="control-button" onClick={() => !played ? player.play() : player.pause()} />
                            : <Loader active inline inverted size="tiny" style={{ marginRight: "1rem" }} />
                        }</span>
                        <div ref={timer}></div>
                    </div>

                    <div>

                        <div>
                            <Icon name={volumeIcon} className="control-button" onClick={muted} />
                        </div>

                        <div className="video-volume-block">
                            <input
                                type="range"
                                max={1}
                                min={0}
                                step={0.01}
                                className="video-volume"
                                value={volume}
                                onChange={e => {
                                    setVolume(e.currentTarget.value);
                                    setAfterMudet(e.currentTarget.value);
                                    player.volume = e.currentTarget.value;
                                }}
                            />
                        </div>

                        <div>
                            <Icon name={fullScreen ? "compress" : "expand"} className="control-button" onClick={toggleFullscreen} />
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

}

export default (VideoPlayer);