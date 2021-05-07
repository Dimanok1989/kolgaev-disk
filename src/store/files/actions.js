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

export const OPEN_FOLDER = "OPEN_FOLDER";
export const setOpenFolder = id => ({
    type: OPEN_FOLDER,
    payload: id
});

export const BREAD_CRUMBS = "BREAD_CRUMBS";
export const setBreadCrumbs = crumbs => ({
    type: BREAD_CRUMBS,
    payload: crumbs
});