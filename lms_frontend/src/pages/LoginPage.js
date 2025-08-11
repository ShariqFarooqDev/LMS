import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as API from '../services/api';

// Accept onLogin as a prop to communicate with App.js
const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.login({ username, password });
            onLogin(); // Notify App.js that the user is logged in
            navigate('/'); // Redirect to the homepage
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your username and password.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
