import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import CourseDetails from './pages/CourseDetails';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </Router>
  );
}
