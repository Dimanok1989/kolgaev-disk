import * as ACTIONS from './actions'

const defaultState = {
    filesList: [], // Список файлов
    loadingFiles: false, // Идентификатор загрузки списка файлов
    openFolder: false, // Открытый каталог
    breadCrumbs: [], // Хлебные крошки
    photo: null, // Идентификатор просматриваемого фото
    rename: null, // Идентификатор файла для смены имени
    createFolder: false, // Открытие модального окна создания нового каталога
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

        case ACTIONS.FILE_LIST_UPDATE_SOCKET:

            let files = [...state.filesList],
                data = action.payload;

            console.log(action.payload);

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

            return state;

        default:
            return state;

    }

}