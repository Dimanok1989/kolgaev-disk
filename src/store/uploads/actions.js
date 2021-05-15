export const SHOW_UPLOAD_MODAL = "SHOW_UPLOAD_MODAL";
export const setOpenUploadModal = show => ({
    type: SHOW_UPLOAD_MODAL,
    payload: show
});


export const UPLOAD_PROCESS = "UPLOAD_PROCESS";
export const setUploadProcess = process => ({
    type: UPLOAD_PROCESS,
    payload: process
});