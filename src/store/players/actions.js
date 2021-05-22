export const AUDIO_PLAYER = "AUDIO_PLAYER";
export const setAudioPlayer = player => ({
    type: AUDIO_PLAYER,
    payload: player
});

export const AUDIO_PLAY = "AUDIO_PLAY";
export const setAudioPlay = file => ({
    type: AUDIO_PLAY,
    payload: file
});

export const AUDIO_PLAYED = "AUDIO_PLAYED";
export const setAudioPlayed = played => ({
    type: AUDIO_PLAYED,
    payload: played
});

export const AUDIO_VISUAL = "AUDIO_VISUAL";
export const setVisual = visual => ({
    type: AUDIO_VISUAL,
    payload: visual
});