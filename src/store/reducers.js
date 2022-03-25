import { combineReducers } from "redux";
import * as ACTIONS from "./actions";
import { usersReducer } from "./users/reducers";
// import { filesReducer } from "./files/reducers";
import { uploadsReducer } from "./uploads/reducers";
import { playersReducer } from "./players/reducers";
import { chatReducer } from "./chat/reducers";
import { folderReducer } from "./folder/reducers";

const defaultState = {
    isLogin: false, // Идентификатор авторизации
    isBlock: false, // Идентификатор ограничения доступа
    user: {}, // Данные пользователя
};

export default combineReducers({
    chat: chatReducer,
    users: usersReducer,
    folder: folderReducer,
    // files: filesReducer,
    uploads: uploadsReducer,
    players: playersReducer,
    main: (state = defaultState, action) => {
        switch (action.type) {
            case ACTIONS.IS_LOGIN:
                return { ...state, isLogin: action.payload }
            case ACTIONS.IS_BLOCK:
                return { ...state, isBlock: action.payload }
            case ACTIONS.USER_DATA:
                return { ...state, user: action.payload }
            default:
                return state;
        }
    }
});