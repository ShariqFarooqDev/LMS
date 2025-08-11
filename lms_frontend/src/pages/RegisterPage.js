import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as API from '../services/api';

// Accept onRegister as a prop to communicate with App.js
const RegisterPage = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Step 1: Register the new user
            await API.register({ username, email, password });

            // Step 2: Automatically log the new user in
            await API.login({ username, password });

            // Step 3: Notify App.js and redirect
            onRegister(); // Notify App.js that the user is now logged in
            navigate('/'); // Redirect to the homepage
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. The username or email might already be taken.');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
