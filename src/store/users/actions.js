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

export const ONLINE_USERS = "ONLINE_USERS";
export const setOnlineUsers = users => ({
    type: ONLINE_USERS,
    payload: users
});

export const ONLINE_USER_JOIN = "ONLINE_USER_JOIN";
export const setOnlineUserJoining = user => ({
    type: ONLINE_USER_JOIN,
    payload: user
});

export const ONLINE_USER_LEAV = "ONLINE_USER_LEAV";
export const setOnlineUserLeaving = user => ({
    type: ONLINE_USER_LEAV,
    payload: user
});