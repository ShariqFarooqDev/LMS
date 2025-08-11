import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Correctly import the API functions
import * as API from '../services/api';

const QuizPage = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        // This is a placeholder for fetching a specific quiz's questions.
        // In a real app, you would have an API endpoint like getQuizDetails(id).
        const fetchQuiz = async () => {
             // For now, we'll just simulate a quiz structure.
             // You would replace this with an actual API call.
             setQuiz({
                 id: id,
                 title: `Quiz ${id}`,
                 questions: [
                     { id: 1, text: 'What is 2 + 2?' },
                     { id: 2, text: 'What is the capital of France?' }
                 ]
             });
        };
        fetchQuiz();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.submitQuiz(id, answers);
            alert('Quiz submitted!');
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz.');
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: value,
        });
    };

    if (!quiz) return <div>Loading quiz...</div>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <form onSubmit={handleSubmit}>
                {quiz.questions.map(q => (
                    <div key={q.id}>
                        <p>{q.text}</p>
                        <input
                            type="text"
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default QuizPage;
