export const USERS_LIST = "USERS_LIST";
export const setUsersList = users => ({
    type: USERS_LIST,
    payload: users
});

export const SELECT_USER = "SELECT_USER";
export const selectUser = user => ({
    type: SELECT_USER,
    payload: user
});