import React from 'react';
import { connect } from 'react-redux';
import { setAudioPlay, setAudioPlayed, setAudioPlayer } from './../../store/players/actions';
import { setLoadingFile } from './../../store/files/actions';

import axios from './../../system/axios';

import './players.css';
import AudioPlayerControl from './AudioPlayerControl';

function AudioPlayer(props) {

    const { audio, setAudioPlay, setLoadingFile, folder, setAudioPlayed, setAudioPlayer } = props;
    const [url, setUrl] = React.useState(null);
    const [fileInfo, setFileInfo] = React.useState(null);
    const [change, setChange] = React.useState(null);

    React.useEffect(() => {

        if (audio) {

            setAudioPlayed(false);

            if (!change)
                setLoadingFile(audio);

            axios.post('disk/playAudio', { audio }).then(({ data }) => {
                setUrl(data.url);
                setFileInfo(data.audio);
            }).catch(error => {

            }).then(() => {

                if (!change)
                    setLoadingFile(null);

                setChange(null);

            });

        }

    }, [audio]);

    React.useEffect(() => {

        if (change) {

            setAudioPlayed(false);

            axios.post('disk/playAudioChange', { audio, change, folder }).then(({ data }) => {
                setAudioPlay(data.id);
            }).catch(error => {
                setChange(null);
            });

        }

    }, [change]);

    if (!audio || !url)
        return null;

    return <AudioPlayerControl
        url={url}
        fileInfo={fileInfo}
        audio={audio}
        change={change}
        setChange={setChange}
        setAudioPlayed={setAudioPlayed}
        setAudioPlayer={setAudioPlayer}
    />;

}

const mapStateToProps = state => ({
    audio: state.players.audio,
    folder: state.files.openFolder,
});

const mapDispatchToProps = {
    setAudioPlay, setLoadingFile, setAudioPlayed, setAudioPlayer
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);