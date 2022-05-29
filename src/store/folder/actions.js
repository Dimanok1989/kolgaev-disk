import * as TYPES from "./types";

export const setMainFolder = payload => ({ type: TYPES.SET_MAIN_FOLDER, payload });
export const setFiles = payload => ({ type: TYPES.SET_FILES, payload });
export const setUpdateFileRow = payload => ({ type: TYPES.SET_UPDATE_FILE_ROW, payload });
export const setUploadFiles = payload => ({ type: TYPES.SET_UPLOAD_FILES, payload });
export const setCreateFolder = payload => ({ type: TYPES.SET_CREATE_FOLDER, payload });
export const setShowImage = payload => ({ type: TYPES.SET_SHOW_IMAGE, payload });
