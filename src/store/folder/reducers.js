import * as TYPES from "./types";

const defaultState = {
    mainFolder: null,
    files: [],
    uploads: [],
    createFolder: false,
    showImage: null,
}

export const folderReducer = (state = defaultState, action) => {

    let list;

    switch (action.type) {

        case TYPES.SET_MAIN_FOLDER:
            return { ...state, mainFolder: action.payload }

        case TYPES.SET_FILES:
            return { ...state, files: action.payload }

        case TYPES.SET_UPDATE_FILE_ROW:

            list = [...state.files];

            list.forEach((row, i) => {
                if (row.id === action.payload.id) {
                    list[i] = { ...row, ...action.payload }
                }
            });

            return { ...state, files: list }

        case TYPES.SET_UPLOAD_FILES:
            return { ...state, uploads: action.payload }

        case TYPES.SET_CREATE_FOLDER:
            return { ...state, createFolder: action.payload }

        case TYPES.SET_SHOW_IMAGE:
            return { ...state, showImage: action.payload }

        default:
            return state;
    }

}