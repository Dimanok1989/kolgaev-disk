import * as TYPES from "./types";

const defaultState = {
    files: [],
}

export const folderReducer = (state = defaultState, action) => {

    switch (action.type) {

        case TYPES.SET_FILES:
            return { ...state, files: action.payload }

        default:
            return state;
    }

}