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

export const SHOW_PHOTO = "SHOW_PHOTO";
export const setShowPhoto = id => ({
    type: SHOW_PHOTO,
    payload: id
});

export const RENAME_FILE = "RENAME_FILE";
export const setRenameFileId = id => ({
    type: RENAME_FILE,
    payload: id
});

export const SHOW_CREATE_FOLDER = "SHOW_CREATE_FOLDER";
export const setShowCreateFolder = show => ({
    type: SHOW_CREATE_FOLDER,
    payload: show
});

export const FILE_LIST_UPDATE_SOCKET = "FILE_LIST_UPDATE_SOCKET";
export const fileListUpdateSocket = data => ({
    type: FILE_LIST_UPDATE_SOCKET,
    payload: data
});