interface Config {
    API_BASE_URL: string;
    ENV: string;
}

const CONFIG: Config = {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'http://nammaweb.live/',  // Update default
    ENV: import.meta.env.VITE_ENV || 'production'  // Change default to production
};

export default CONFIG;