import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetails from './pages/CourseDetails';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="main-nav">
          <Link to="/" className="nav-logo">LMS</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/my-progress">My Progress</Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/quizzes/:id" element={<QuizPage />} />
            <Route path="/my-progress" element={<ProgressPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
