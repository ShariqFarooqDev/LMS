import React, { useEffect, useState } from 'react';
import * as API from '../services/api';

const ProgressPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                // Fetch real submission data from the backend
                const response = await API.getUserProgress();
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false); // Stop loading once data is fetched or an error occurs
            }
        };

        fetchProgress();
    }, []);

    if (loading) {
        return <div>Loading your progress...</div>;
    }

    return (
        <div>
            <h1>My Progress</h1>
            {submissions.length > 0 ? (
                <ul>
                    {submissions.map((sub) => (
                        <li key={sub.id}>
                            {/* Displaying quiz title and score from the submission */}
                            Quiz: {sub.quiz.title} - Score: {sub.score}%
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have not completed any quizzes yet.</p>
            )}
        </div>
    );
};

export default ProgressPage;
