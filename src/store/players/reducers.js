import * as ACTIONS from './actions'

const defaultState = {
    player: null,
    audio: null, // Воспроизведение музыкального файла
    played: false,
    visual: null,
};

export const playersReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.AUDIO_PLAYER:
            return { ...state, player: action.payload }

        case ACTIONS.AUDIO_PLAY:
            return { ...state, audio: action.payload }

        case ACTIONS.AUDIO_PLAYED:
            return { ...state, played: action.payload }

        case ACTIONS.AUDIO_VISUAL:
            return { ...state, visual: action.payload }

        default:
            return state;

    }

}