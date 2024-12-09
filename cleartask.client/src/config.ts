// src/config.ts

interface Config {
    API_BASE_URL: string;
}

const CONFIG: Config = {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5076'
};

export default CONFIG;