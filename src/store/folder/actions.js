import * as TYPES from "./types";

export const setFiles = data => ({
    type: TYPES.SET_FILES,
    payload: data
});