import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import useFetch from '@/hooks/useFetch';
import Echo from 'laravel-echo';

const HANDLERS = {
    INITIALIZE: 'INITIALIZE',
};

const initialState = {
    loading: true,
    user: null,
    menu: [],
    error: null,
};

const handlers = {

    [HANDLERS.INITIALIZE]: (state, action) => {
        return {
            ...state,
            ...action.payload,
        };
    },
};

const reducer = (state, action) => (
    handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AppContext = createContext({ undefined });

const connectWs = async () => {
    window.io = require('socket.io-client');
    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: `${process.env.NEXT_PUBLIC_WS_PROTOCOL}://${process.env.NEXT_PUBLIC_WS_HOST}`,
        path: process.env.NEXT_PUBLIC_WS_PATH,
        auth: {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-Application-Id': process.env.NEXT_PUBLIC_APP_KEY,
            }
        }
    });
}

export const AppProvider = (props) => {

    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);
    const initialized = useRef(false);
    const { get } = useFetch();

    const initialize = async () => {

        if (initialized.current) {
            return;
        }

        initialized.current = true;

        let payload = {};
        const response = await get('app');
        const data = await response.json();

        if (!response.ok) {
            payload.error = {
                status: response.status,
                message: data?.message || response?.statusText || "Ошибка загрузки",
            };
        } else {
            payload = {
                ...payload,
                ...data,
            }
            await connectWs();
        }

        dispatch({
            type: HANDLERS.INITIALIZE,
            payload: {
                loading: false,
                ...payload,
            }
        });
    };

    const login = async (data) => {
        await connectWs();
        dispatch({
            type: HANDLERS.INITIALIZE,
            payload: {
                loading: false,
                error: null,
                ...data,
            }
        });
    };

    useEffect(() => {
        initialize();
    }, []);

    return <AppContext.Provider value={{
        ...state,
        initialize,
        login
    }}>
        {children}
    </AppContext.Provider>;
};

AppProvider.propTypes = {
    children: PropTypes.node
};

export const AppConsumer = AppContext.Consumer;

export const useAppContext = () => useContext(AppContext);

