import * as TYPES from "./types";

const defaultState = {
    files: [],
    uploads: [],
    createFolder: false,
}

export const folderReducer = (state = defaultState, action) => {

    switch (action.type) {

        case TYPES.SET_FILES:
            return { ...state, files: action.payload }

        case TYPES.SET_UPLOAD_FILES:
            return { ...state, uploads: action.payload }

        case TYPES.SET_CREATE_FOLDER:
            return { ...state, createFolder: action.payload }

        default:
            return state;
    }

}