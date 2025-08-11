import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Correctly import the API functions
import * as API from '../services/api';


const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await API.getCourseDetails(id);
                setCourse(courseRes.data);

                const videosRes = await API.getVideos(id);
                setVideos(videosRes.data);

                const quizzesRes = await API.getQuizzes(id);
                setQuizzes(quizzesRes.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleEnroll = async () => {
        try {
            await API.enrollCourse(id);
            alert('Enrolled successfully!');
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert('Failed to enroll. You might already be enrolled or not logged in.');
        }
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <button onClick={handleEnroll}>Enroll</button>

            <h2>Videos</h2>
            <ul>
                {videos.map(video => (
                    <li key={video.id}>{video.title}</li>
                ))}
            </ul>

            <h2>Quizzes</h2>
            <ul>
                {quizzes.map(quiz => (
                    <li key={quiz.id}>
                        <Link to={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseDetails;
