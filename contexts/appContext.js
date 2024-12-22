import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import useFetch from '@/hooks/useFetch';
import Echo from 'laravel-echo';
import { getCookie } from '@/hooks/useCookies';

const HANDLERS = {
    INITIALIZE: 'INITIALIZE',
    SET_FILES: 'SET_FILES',
    PREPEND_FILE: 'PREPEND_FILE',
    UPLOAD_FILES: 'UPLOAD_FILES',
    SET_GALLERY_IMAGES: 'SET_GALLERY_IMAGES',
    SET_GALLERY_ACTIVE_INDEX: 'SET_GALLERY_ACTIVE_INDEX',
    SET_WATCH_IMAGE: 'SET_WATCH_IMAGE',
};

const initialState = {
    loading: true,
    user: null,
    menu: [],
    error: null,
    files: [],
    galleryImages: {},
    galleryActiveIndex: 0,
    watchImages: {},
};

const handlers = {

    [HANDLERS.INITIALIZE]: (state, action) => {
        return {
            ...state,
            ...action.payload,
        };
    },

    [HANDLERS.SET_FILES]: (state, action) => {
        return {
            ...state,
            files: action.payload,
        };
    },

    [HANDLERS.PREPEND_FILE]: (state, action) => {
        return {
            ...state,
            files: [action.payload, ...state.files],
        };
    },

    [HANDLERS.SET_GALLERY_IMAGES]: (state, action) => ({
        ...state,
        galleryImages: {
            ...state.galleryImages,
            [action.payload.folder]: action.payload?.images || []
        }
    }),

    [HANDLERS.SET_GALLERY_ACTIVE_INDEX]: (state, action) => ({
        ...state, galleryActiveIndex: action.payload,
    }),

    [HANDLERS.SET_WATCH_IMAGE]: (state, action) => ({
        ...state,
        watchImages: {
            ...state.watchImages,
            [action.payload?.id]: action.payload?.image || null
        }
    }),
};

const reducer = (state, action) => (
    handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AppContext = createContext({ undefined });

const connectWs = async () => {
    const token = getCookie('kolgaev_api_token') || localStorage.getItem('kolgaev_api_token');
    window.io = require('socket.io-client');
    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: `${process.env.NEXT_PUBLIC_WS_PROTOCOL}://${process.env.NEXT_PUBLIC_WS_HOST}`,
        path: process.env.NEXT_PUBLIC_WS_PATH,
        auth: {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Application-Id': process.env.NEXT_PUBLIC_APP_KEY,
            }
        }
    });
}

export const AppProvider = (props) => {

    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);
    const initialized = useRef(false);
    const galleria = useRef(null);
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

    const setFiles = (files) => dispatch({
        type: HANDLERS.SET_FILES,
        payload: files
    });

    const prependFile = (file) => dispatch({
        type: HANDLERS.PREPEND_FILE,
        payload: file
    });

    const setGalleryImages = (folder, images) => dispatch({
        type: HANDLERS.SET_GALLERY_IMAGES,
        payload: { folder, images }
    });

    const setGalleryActiveIndex = (index) => dispatch({
        type: HANDLERS.SET_GALLERY_ACTIVE_INDEX,
        payload: index
    });

    const setWatchImages = (id, image) => dispatch({
        type: HANDLERS.SET_WATCH_IMAGE,
        payload: { id, image }
    });

    useEffect(() => {
        initialize();
    }, []);

    return <AppContext.Provider value={{
        ...state,
        initialize,
        login,
        setFiles,
        prependFile,
        galleria,
        setGalleryImages,
        setGalleryActiveIndex,
        setWatchImages,
    }}>
        {children}
    </AppContext.Provider>;
};

AppProvider.propTypes = {
    children: PropTypes.node
};

export const AppConsumer = AppContext.Consumer;

export const useAppContext = () => useContext(AppContext);

