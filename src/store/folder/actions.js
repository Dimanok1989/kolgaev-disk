import * as TYPES from "./types";

export const setFiles = payload => ({ type: TYPES.SET_FILES, payload });
export const setUploadFiles = payload => ({ type: TYPES.SET_UPLOAD_FILES, payload });
export const setCreateFolder = payload => ({ type: TYPES.SET_CREATE_FOLDER, payload });
