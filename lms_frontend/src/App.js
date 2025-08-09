import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/home';
import CourseDetails from './pages/CourseDetails';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        // No need for navigate here as the component will re-render
    };

    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/">Home</Link>
                    {isAuthenticated ? (
                        <>
                            {/* You can add a link to a profile page here if you want */}
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses/:id" element={<CourseDetails />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/progress/:courseId" element={<ProgressPage />} />
                    <Route path="/login" element={<LoginPage setAuth={setIsAuthenticated} />} />
                    <Route path="/register" element={<RegisterPage setAuth={setIsAuthenticated} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
