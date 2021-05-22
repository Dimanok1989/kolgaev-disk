import React from 'react';
import { Icon, Loader } from 'semantic-ui-react';

import ChangeVolume from './ChangeVolume';

const player = new Audio();

const getTimer = duration => {

    let hours = Math.floor(duration / 60 / 60);
    let minutes = Math.floor(duration / 60) - (hours * 60);
    let seconds = Math.floor(duration % 60);

    let format = [];

    if (hours)
        format.push(hours.toString().padStart(2, '0'));

    format.push(minutes.toString().padStart(2, '0'));
    format.push(seconds.toString().padStart(2, '0'));

    return (duration > 0 ? '-' : '') + format.join(':');

}

let timeInterval;

function AudioPlayerControl(props) {

    const { url, audio, fileInfo } = props;
    const { change, setChange, setAudioPlayed } = props;

    const [paused, setPaused] = React.useState(true);

    const [list, setList] = React.useState([]);
    const [current, setCurrent] = React.useState(null);

    const progress = React.useRef(null);
    const bar = React.useRef(null);
    const load = React.useRef(null);
    const timer = React.useRef(null);

    const interval = () => {
        bar.current.style.width = `${Math.floor((player.currentTime * 100) / player.duration)}%`;
        timer.current.textContent = getTimer(player.duration - player.currentTime);
    }

    const play = () => {

        if (!player.paused)
            stop();

        player.play();
        timer.current.textContent = getTimer(player.duration - player.currentTime);
        timeInterval = setInterval(interval, 1000);

        setPaused(player.paused);

    }

    const stop = () => {

        player.pause();
        clearInterval(timeInterval);
        setPaused(player.paused);

    }

    const setTime = e => {

        let width = progress.current.offsetWidth,
            click = e.pageX - progress.current.getBoundingClientRect().left,
            percent = Number((click * 100) / width).toFixed(2),
            time = +Number(player.duration * percent / 100).toFixed(2);

        clearInterval(timeInterval);

        player.currentTime = time;

        timer.current.textContent = getTimer(player.duration - time);
        bar.current.style.width = `${percent}%`;

        timeInterval = setInterval(interval, 1000);

    }

    const back = () => {

        if (current === 0) {
            setList([]);
            return setChange("next");
        }

        let changeList = list.splice(current - 1, 1);
        setList(changeList);
        return setChange(changeList[changeList.length - 1]);

    }

    React.useEffect(() => {

        player.id = "audio-player";
        player.crossOrigin = "anonymous";

        if (!player.paused)
            player.pause();

        player.onloadedmetadata = e => {

            bar.current.style.width = 0;
            timer.current.textContent = getTimer(player.duration);

            // const audioVisualisation = document.getElementById(`audio-visualisation-${audio}`);

            // if (audioVisualisation) {

            // }

            // console.log(audioVisualisation);

        }

        player.oncanplay = () => {
            bar.current.classList.remove('audio-error');
            play();
        };

        player.onended = () => {
            timer.current.textContent = getTimer(0);
            bar.current.style.width = 0;
            setChange("next");
        }

        player.onerror = () => {
            bar.current.classList.add('audio-error');
        }

        var audioCtx = window.AudioContext || window.webkitAudioContext;
        var canvas;
        var audioContext, canvasContext;
        var analyser;
        var width, height;
        var dataArray, bufferLength;

        audioContext = new audioCtx();

        function buildAudioGraph() {

            player.onplay = () => { audioContext.resume(); }

            // исправлено для политики автозапуска
            player.addEventListener('play', () => audioContext.resume());

            var sourceNode = audioContext.createMediaElementSource(player);

            // Создать узел анализатора
            analyser = audioContext.createAnalyser();

            // Попробуйте изменить на более низкие значения: 512, 256, 128, 64 ...
            analyser.fftSize = 64;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            sourceNode.connect(analyser); 
            analyser.connect(audioContext.destination);

        }

        function visualize() {
            // очистить canvas
            canvasContext.clearRect(0, 0, width, height);

            // Или используйте заливку RGBA, чтобы получить небольшой эффект размытия
            //canvasContext.fillStyle = 'rgba (0, 0, 0, 0.5)';
            //canvasContext.fillRect(0, 0, width, height);

            // Получить данные анализатора
            analyser.getByteFrequencyData(dataArray);

            var barWidth = width / bufferLength;
            barWidth = 1;
            var barHeight, heightScale;
            var x = 0;

            // значения изменяются от 0 до 256, а высота холста равна 100. Давайте изменим масштаб
            // перед отрисовкой. Это масштабный коэффициент
            heightScale = height / 128;

            for (var i = 0; i < bufferLength; i++) {

                barHeight = dataArray[i];

                canvasContext.fillStyle = 'rgb(' + (barHeight + 0) + ',0,0)';
                // canvasContext.fillStyle = 'rgb(0,0,0)';
                barHeight *= heightScale;
                canvasContext.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

                // 2 - количество пикселей между столбцами
                x += barWidth + 1;
                
            }

            // вызовите снова функцию визуализации со скоростью 60 кадров / с
            requestAnimationFrame(visualize);

        }

        audioContext = new audioCtx();

        canvas = document.querySelector("#audio-visualisation");
        width = canvas.width;
        height = canvas.height;

        canvasContext = canvas.getContext('2d');

        buildAudioGraph();
        requestAnimationFrame(visualize);

        return () => {
            stop();
            setPaused(true);
        }

    }, []);

    React.useEffect(() => {

        if (url) {

            stop();
            player.src = url;

            let changeList = [...list];
            setCurrent(changeList.length);

            if (changeList[changeList.length - 1] !== audio)
                setList([...changeList, audio]);

        }

    }, [url]);

    React.useEffect(() => {
        setAudioPlayed(!paused);
    }, [paused]);

    return <div className="audio-player">

        <canvas id="audio-visualisation" className="audio-visualisation-canvas" width="40" height="20"></canvas>

        <div className={`audio-control`}>
            <Icon name="step backward" onClick={back} />
            <Icon name={paused ? "play" : "pause"} onClick={() => paused ? play() : stop()} />
            <Icon name="step forward" onClick={() => setChange("next")} />
            {change
                ? <div className="change-loading"><Loader active inline size="tiny" /></div>
                : null
            }
        </div>

        <div className="audio-name">{fileInfo?.name || ""}</div>

        <div className="audio-timer" id="audio-timer" ref={timer}></div>

        <div className="audio-progress-bg" onClick={setTime} ref={progress}>
            <div className="audio-progress-load" ref={load}></div>
            <div className="audio-progress-bar" ref={bar}></div>
        </div>

        <ChangeVolume player={player} />

    </div>

}

export default (AudioPlayerControl);