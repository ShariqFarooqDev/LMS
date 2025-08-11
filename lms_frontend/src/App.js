import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetails from './pages/CourseDetails';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import * as API from './services/api';

// A wrapper component to include navigation logic
const AppContent = () => {
    // Check for token in localStorage to determine initial auth state
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    const navigate = useNavigate();

    useEffect(() => {
        // This effect will run if the auth state changes,
        // ensuring the UI is always in sync.
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('access_token'));
        };
        // Listen for storage changes to sync across tabs
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    const handleLogout = () => {
        API.logout(); // Clear tokens from localStorage
        setIsAuthenticated(false); // Update state
        navigate('/login'); // Redirect to login page
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="App">
            {/* Navigation Bar */}
            <nav className="main-nav">
                <Link to="/" className="nav-logo">LMS</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/my-progress">My Progress</Link>
                            <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Page Content */}
            <main className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
                    <Route path="/courses/:id" element={<CourseDetails />} />
                    <Route path="/quizzes/:id" element={<QuizPage />} />
                    <Route path="/my-progress" element={<ProgressPage />} />
                </Routes>
            </main>
        </div>
    );
}


// Main App component that includes the Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
