import React from 'react';
import { Icon, Input } from 'semantic-ui-react';

function ChangeVolume(props) {

    const { player } = props;

    const block = React.useRef(null);
    const lastVolume = localStorage.getItem('audio_volume') || null;

    const [icon, setIcon] = React.useState('volume up');
    const [afterMuted, setAfterMudet] = React.useState(lastVolume || 0);
    const [volume, setVolume] = React.useState(lastVolume || player.volume);
    const [mute, setMute] = React.useState(false);

    React.useEffect(() => {

        if (lastVolume)
            player.volume = lastVolume;

    }, []);

    React.useEffect(() => {

        if (player.volume <= 0.01)
            setIcon("volume off");
        else if (player.volume < 0.7)
            setIcon("volume down");
        else
            setIcon("volume up");

        localStorage.setItem('audio_volume', volume);

    }, [volume]);

    const muted = () => {

        if (!mute)
            player.volume = 0.01;
        else if (afterMuted === 0)
            player.volume = 1;
        else
            player.volume = afterMuted;

        setVolume(player.volume);
        setMute(!mute);

    }

    return <div className="change-volume no-mobile" ref={block}>

        <div id="change-volume-rang" className="change-volume-rang">

            <div className="rang-content">
                <input
                    type="range"
                    max={1}
                    min={0.01}
                    step={0.01}
                    className="volume-range"
                    value={volume}
                    onChange={e => {
                        setVolume(e.currentTarget.value);
                        setAfterMudet(e.currentTarget.value);
                        player.volume = e.currentTarget.value;
                    }}
                />
            </div>

            <div>
                <Icon name={icon} className="change-volume-second-button" onClick={muted} />
            </div>

        </div>

        <Icon name={icon} className="change-volume-button" onClick={muted} />

    </div>

}

export default ChangeVolume;