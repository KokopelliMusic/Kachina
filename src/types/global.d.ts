declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_TAWA_URL: string;
            REACT_APP_TAWA_WS: string;
            REACT_APP_STATIC_URL: string;
            REACT_APP_SPOTIFY_SEARCH_STRING: string;
            REACT_APP_SPOTIFY_CLIENT_ID: string;
            REACT_APP_SPOTIFY_AUTH: string;
            REACT_APP_BASE_URL: string;
            REACT_APP_KOKOPELLI_URL: string;
            REACT_APP_LOCALHOST: string;
            REACT_APP_LINK_URL: string;
        }
    }
}

export {}