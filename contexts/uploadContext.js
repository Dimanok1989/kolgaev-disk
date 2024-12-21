import { createContext, useContext, useReducer } from "react";

const SET_QUEUE_UPLOAD_FILES = 'SET_QUEUE_UPLOAD_FILES';
const SET_PROCESS_UPLOAD_FILES = 'SET_PROCESS_UPLOAD_FILES';

// export const UPLOAD_CHUNK_SIZE = 4242880;
export const UPLOAD_CHUNK_SIZE = 1048576;

const initialState = {
    process: {
        items: []
    },
}

const handlers = {
    [SET_QUEUE_UPLOAD_FILES]: (state, action) => {
        const files = [...state.files, ...action.payload];
        return { ...state, files }
    },
    [SET_PROCESS_UPLOAD_FILES]: (state, action) => {
        return {
            ...state,
            process: action.payload,
        }
    }
}

const reducer = (state = initialState, action) => (
    handlers[action.type] ? handlers[action.type](state, action) : state
)

export const UploadContext = createContext({ undefined });

export const UploadProvider = (props) => {

    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    const setProcess = data => {
        dispatch({ type: SET_PROCESS_UPLOAD_FILES, payload: data });
    }

    const value = {
        ...state,
        setProcess,
    };

    return <UploadContext.Provider value={value}>
        {children}
    </UploadContext.Provider>;
}

export const useUpload = () => useContext(UploadContext);

export const getChunkFile = async (key, file, item, setProcess) => {

    return new Promise((resolve, reject) => {

        let reader = new FileReader();

        // Вывод ошибки чтения файла
        reader.onerror = event => {

            setProcess(p => {
                p[key].status = "error";
                return p;
            });

            console.error("Failed to read file!\n" + reader.error);

            reader.abort();
            resolve(false);
        }

        reader.onloadend = (evt) => {

            let base64 = String(reader.result),
                len = base64.indexOf(',');

            base64 = len > 0 ? base64.substring(len + 1) : base64;

            resolve(base64);
        };

        let blob = file.slice(item.chunkOffset, item.chunkOffset + UPLOAD_CHUNK_SIZE);
        reader.readAsDataURL(blob);
    });
}
