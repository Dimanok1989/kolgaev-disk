import * as ACTIONS from './actions'

const defaultState = {
    usersList: [], // Список пользователей для выбора к просмотру файлов
    selectedUser: null, // Выбранный пользователь для просмотра файлов
    online: [], // Список идентификаторов пользователей онлайн
};

export const usersReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.USERS_LIST:
            return { ...state, usersList: action.payload }

        case ACTIONS.SELECT_USER:
            return { ...state, selectedUser: action.payload }

        case ACTIONS.ONLINE_USERS:
            let online = [];
            action.payload.forEach(user => online.push(user.id));
            return { ...state, online }

        case ACTIONS.ONLINE_USER_JOIN:
            let joining = [...state.online];
            joining.push(action.payload.id);
            return { ...state, online: joining }

        case ACTIONS.ONLINE_USER_LEAV:
            let leaving = [];
            state.online.forEach(user => {
                if (action.payload.id !== user)
                    leaving.push(user);
            });
            return { ...state, online: leaving }

        default:
            return state;

    }

}