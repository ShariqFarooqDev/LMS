import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as API from '../services/api';

const QuizPage = () => {
    const { id } = useParams(); // This is the quiz ID
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await API.getQuizDetails(id);
                setQuiz(response.data);
            } catch (error) {
                console.error('Error fetching quiz details:', error);
                alert('Failed to load quiz. You may not be enrolled in this course.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleAnswerChange = (questionId, choiceId) => {
        setAnswers({
            ...answers,
            [questionId]: choiceId,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(answers).length !== quiz.questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        try {
            await API.submitQuiz(id, answers);
            alert('Quiz submitted successfully!');
            navigate('/my-progress'); // Redirect to progress page after submission
        } catch (error) {
            console.error('Error submitting quiz:', error.response);
            // Provide a more specific error message from the backend if available
            const errorMessage = error.response?.data[0] || 'Failed to submit quiz.';
            alert(errorMessage);
        }
    };

    if (isLoading) return <div>Loading quiz...</div>;
    if (!quiz) return <div>Quiz not found.</div>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
            <form onSubmit={handleSubmit}>
                {quiz.questions.map((question) => (
                    <div key={question.id} className="question-block">
                        <p className="question-text">{question.text}</p>
                        <div className="choices-block">
                            {question.choices.map((choice) => (
                                <label key={choice.id} className="choice-label">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={choice.id}
                                        onChange={() => handleAnswerChange(question.id, choice.id)}
                                        required
                                    />
                                    {choice.text}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit">Submit Answers</button>
            </form>
        </div>
    );
};

export default QuizPage;
