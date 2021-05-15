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

        default:
            return state;

    }

}