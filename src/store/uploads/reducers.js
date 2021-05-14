import * as ACTIONS from './actions'

const defaultState = {
    show: false,
};

export const uploadsReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.SHOW_UPLOAD_MODAL:
            return { ...state, show: action.payload }

        default:
            return state;

    }

}