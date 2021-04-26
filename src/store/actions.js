export const IS_LOGIN = "IS_LOGIN";
export const setIsLogin = login => ({
    type: IS_LOGIN,
    payload: login
});

export const IS_BLOCK = "IS_BLOCK";
export const setIsBlock = block => ({
    type: IS_BLOCK,
    payload: block
});

export const USER_DATA = "USER_DATA";
export const setUserData = user => ({
    type: USER_DATA,
    payload: user
});