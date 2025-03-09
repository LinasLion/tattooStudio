const getAccessToken = () => localStorage.getItem('accessToken');

const setToken = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
};

const removeToken = () => {
    localStorage.removeItem('accessToken');
};

const isAuthenticated = () => !!getAccessToken();

export {
    getAccessToken,
    setToken,
    removeToken,
    isAuthenticated
};