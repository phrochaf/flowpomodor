let API_URL;

if(process.env.NODE_ENV === 'production'){
    API_URL = 'https://flowpomodor-api.onrender.com';
} else {
    API_URL = 'http://localhost:5001';
}

export { API_URL };