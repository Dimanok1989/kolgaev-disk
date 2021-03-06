import * as ACTIONS from './actions'

const defaultState = {
    filesList: [], // Список файлов
    loadingFiles: false, // Идентификатор загрузки списка файлов
    openFolder: false, // Открытый каталог
    breadCrumbs: [], // Хлебные крошки
    photo: null, // Идентификатор просматриваемого фото
    rename: null, // Идентификатор файла для смены имени
    createFolder: false, // Открытие модального окна создания нового каталога
    showDelete: false, // Открытие модального окна удаления файла
    createArchiveProcess: null, // Процесс создания архива
    createArchiveComplete: null, // Звршения процесса создания архива
    downloadArchive: null,
    loadingFile: null,
};

export const filesReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.FILES_LIST:
            return { ...state, filesList: action.payload }

        case ACTIONS.LODING_FILES:
            return { ...state, loadingFiles: action.payload }

        case ACTIONS.OPEN_FOLDER:
            return { ...state, openFolder: action.payload }

        case ACTIONS.BREAD_CRUMBS:
            return { ...state, breadCrumbs: action.payload }

        case ACTIONS.SHOW_PHOTO:
            return { ...state, photo: action.payload }

        case ACTIONS.RENAME_FILE:
            return { ...state, rename: action.payload }

        case ACTIONS.SHOW_CREATE_FOLDER:
            return { ...state, createFolder: action.payload }

        case ACTIONS.SHOW_DELTE_FILE:
            return { ...state, showDelete: action.payload }

        case ACTIONS.FILE_LIST_UPDATE_SOCKET:

            let files = [...state.filesList],
                data = action.payload;

            if (data.thumbnails && Number(state.openFolder) === Number(data?.in_dir)) {

                let file = files.findIndex(item => item.id === data.thumbnails.id);
                if (file >= 0) {
                    files[file].thumb_litle = data.thumbnails.litle;
                    files[file].thumb_middle = data.thumbnails.middle;
                }
                return { ...state, filesList: files }

            }

            if (data.mkdir && Number(state.openFolder) === Number(data?.mkdir?.in_dir)) {
                files.unshift(data.mkdir);
                return { ...state, filesList: files }
            }

            if (data.new && Number(state.openFolder) === Number(data?.new?.in_dir)) {
                files.push(data.new);
                return { ...state, filesList: files }
            }

            if (data.rename && Number(state.openFolder) === Number(data?.rename?.in_dir)) {
                for (let id in files) {
                    if (files[id].id === data.rename.id)
                        files[id].name = data.rename.name;
                }
                return { ...state, filesList: files }
            }

            if (data.archive && window._userId === data.archive?.user_id) {
                return { ...state, createArchiveComplete: data }
            }

            if (data.hide && window._userId === data.hide?.user) {

                for (let id in files) {
                    if (files[id].id === data.hide.id)
                        files[id].hiden = data.hide.hiden;
                }

                return { ...state, filesList: files }

            }
            else if (data.hide && window._userId !== data.hide?.user) {

                let file = files.findIndex(item => item.id === data.hide.id);

                if (data.hide.hiden === 1) {
                    if (file >= 0)
                        files.splice(file, 1);
                }
                else if (file < 0) {
                    files.push(data.hide);
                }

                return { ...state, filesList: files }
            }

            return state;

        case ACTIONS.CREATE_ARCHIVE_PROCESS:
            return { ...state, createArchiveProcess: action.payload }

        case ACTIONS.CREATE_ARCHIVE_COMPLETE:
            return { ...state, createArchiveComplete: action.payload }

        case ACTIONS.START_DOWNLOAD_ARCHIVE:
            return { ...state, downloadArchive: action.payload }

        case ACTIONS.LOADING_FILE_DATA:
            return { ...state, loadingFile: action.payload }

        default:
            return state;

    }

}