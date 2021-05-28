import * as ACTIONS from './actions'

const defaultState = {
    messages: [],
};

export const chatReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.MESSAGES_LIST:
            return { ...state, messages: action.payload }

        case ACTIONS.UPDATE_MESSAGES_LIST:

            let messages = [...state.messages];
            let data = action.payload;

            /** Новое сообщение */
            if (data.new) {
                messages.unshift(data.new);
                return { ...state, messages: messages }
            }

            /** Обновление сообщения */
            if (data.update) {
                let id = messages.findIndex(item => item.id === data.id);
                if (id >= 0) {
                    messages[id] = data.update;
                }
                return { ...state, messages: messages }
            }

            return { ...state, messages: messages }

        default:
            return state;

    }

}