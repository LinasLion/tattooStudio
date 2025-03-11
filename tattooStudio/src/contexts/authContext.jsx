import React, {createContext, useState, useContext, useEffect} from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');


        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));

            if (payload.exp < Date.now() / 1000) {
                logout();
                return;
            }

            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (password) => {
        setError(null);

        try {
            const response = await api.post('/auth/login', {password});
            const {token} = response.data;

            localStorage.setItem('token', token);
            setIsAuthenticated(true);

            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        isLoading,
        error,
        login,
        logout
    };

    return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};