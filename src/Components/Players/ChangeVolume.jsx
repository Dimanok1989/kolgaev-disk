import React from 'react';
import { Icon, Input } from 'semantic-ui-react';

function ChangeVolume(props) {

    const { player } = props;

    const block = React.useRef(null);

    const [icon, setIcon] = React.useState('volume up');
    const [afterMuted, setAfterMudet] = React.useState(player.volume);
    const [volume, setVolume] = React.useState(player.volume);

    React.useEffect(() => {


        console.log(block);

    }, []);

    React.useEffect(() => {

        if (player.volume === 0)
            setIcon("volume off");
        else if (player.volume < 0.7)
            setIcon("volume down");
        else
            setIcon("volume up");

    }, [volume]);

    const muted = () => {

        if (player.volume !== 0)
            player.volume = 0;
        else if (afterMuted === 0)
            player.volume = 1;
        else
            player.volume = afterMuted;

        setVolume(player.volume);

    }

    return <div className="change-volume" ref={block}>

        <div id="change-volume-rang" className="change-volume-rang">

            <div className="rang-content">
                <input
                    type="range"
                    max={1}
                    min={0}
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