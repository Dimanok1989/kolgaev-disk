import { setIsLogin, setIsBlock, setUserData } from "./actions";
import * as folder from "./folder/actions";

export const actions = {
    setIsLogin,
    setIsBlock,
    setUserData,
    ...folder,
}

export default actions;