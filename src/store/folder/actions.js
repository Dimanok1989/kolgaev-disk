import * as TYPES from "./types";

export const setFiles = data => ({
    type: TYPES.SET_FILES,
    payload: data
});

export const setUploadFiles = data => ({
    type: TYPES.SET_UPLOAD_FILES,
    payload: data
});
