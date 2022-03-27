import * as TYPES from "./types";

const defaultState = {
    files: [],
    uploads: [],
}

export const folderReducer = (state = defaultState, action) => {

    switch (action.type) {

        case TYPES.SET_FILES:
            return { ...state, files: action.payload }

        case TYPES.SET_UPLOAD_FILES:
            return { ...state, uploads: action.payload }

        default:
            return state;
    }

}