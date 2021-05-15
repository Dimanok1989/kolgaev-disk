import * as ACTIONS from './actions'

const defaultState = {
    show: false,
    uploadProcess: false, // Процесс загрузки файлов
};

export const uploadsReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.SHOW_UPLOAD_MODAL:
            return { ...state, show: action.payload }

        case ACTIONS.UPLOAD_PROCESS:
            return { ...state, uploadProcess: action.payload }

        default:
            return state;

    }

}