import React, { useEffect, useState } from 'react';
// Correctly import the API functions
import * as API from '../services/api';


const ProgressPage = () => {
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        // This is a placeholder for fetching user progress.
        // You would need a `getMyProgress` endpoint in your API.
        const fetchProgress = async () => {
            // const response = await API.getMyProgress();
            // setProgress(response.data);
            // Simulating progress data for now
            setProgress([
                { course: 'Introduction to Python', score: 85 },
                { course: 'Advanced Django', score: 92 }
            ]);
        };

        fetchProgress();
    }, []);

    return (
        <div>
            <h1>My Progress</h1>
            <ul>
                {progress.map((p, index) => (
                    <li key={index}>
                        {p.course}: {p.score}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProgressPage;
