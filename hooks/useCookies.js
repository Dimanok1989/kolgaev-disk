export const getCookie = key => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const useCookies = () => {
    return {
        getCookie
    }
}

export default useCookies;