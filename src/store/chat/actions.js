export const MESSAGES_LIST = "MESSAGES_LIST";
export const setMessagesList = message => ({
    type: MESSAGES_LIST,
    payload: message
});

export const UPDATE_MESSAGES_LIST = "UPDATE_MESSAGES_LIST";
export const updateMessagesList = message => ({
    type: UPDATE_MESSAGES_LIST,
    payload: message
});