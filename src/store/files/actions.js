export const FILES_LIST = "FILES_LIST";
export const setFilesList = files => ({
    type: FILES_LIST,
    payload: files
});

export const LODING_FILES = "LODING_FILES";
export const setLoadingFiles = flag => ({
    type: LODING_FILES,
    payload: flag
});