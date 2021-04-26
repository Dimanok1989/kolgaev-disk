import * as ACTIONS from './actions'

const defaultState = {
    usersList: [], // Список пользователей для выбора к просмотру файлов
    selectedUser: null, // Выбранный пользователь для просмотра файлов
};

export const usersReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.USERS_LIST:
            return { ...state, usersList: action.payload }

        case ACTIONS.SELECT_USER:
            return { ...state, selectedUser: action.payload }

        default:
            return state;

    }

}