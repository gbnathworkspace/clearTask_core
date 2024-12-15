interface Config {
    API_BASE_URL: string;
    ENV: string;
}

const CONFIG: Config = {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5076/',
    ENV: import.meta.env.VITE_ENV || 'development'
};

export default CONFIG;