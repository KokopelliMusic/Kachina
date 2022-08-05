import { Client, Databases } from 'appwrite'
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
            REACT_APP_BASE_URL: string;
            REACT_APP_KOKOPELLI_URL: string;
            REACT_APP_LOCALHOST: string;
            REACT_APP_LINK_URL: string;
            REACT_APP_APPWRITE_URL: string;
            REACT_APP_APPWRITE_PROJECT: string;
        }
    }

    interface Window {
        sipapu: Sipapu;
        api: Client;
        db: Databases;
    }
}

export {}