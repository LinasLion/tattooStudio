import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";
import apiClient from "../services/api";

export function Login() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            alert("Please enter your password");
            return;
        }

        setLoading(true);

        try {
            const response = await apiClient.post("/auth/login", { password });

            localStorage.setItem("token", response.data.token);

            window.location.reload();
            navigate('/home');
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Authentication failed";
            alert("Invalid password. Please try again.");
            console.error("Login error:", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <div className="login-container">
                <h1 className="websiteTitle">TATTOO STUDIO</h1>
                <div className="login-form-wrapper">
                    <h2 className="login-title">Admin Access</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="login-button" disabled={loading}>
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}