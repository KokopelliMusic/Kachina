import { Sipapu } from 'sipapu'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_TAWA_URL: string;
            REACT_APP_SUPABASE_URL: string;
            REACT_APP_SUPABASE_KEY: string;
            REACT_APP_SPOTIFY_SEARCH_STRING: string;
            REACT_APP_SPOTIFY_CLIENT_ID: string;
            REACT_APP_SPOTIFY_AUTH: string;
        }
    }

    interface Window {
        sipapu: Sipapu;
    }
}

export {}