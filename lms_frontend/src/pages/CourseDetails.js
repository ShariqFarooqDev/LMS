import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as API from '../services/api';


const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Effect 1: Fetch primary course data and check enrollment status
    useEffect(() => {
        const fetchPrimaryData = async () => {
            // A user must be logged in to see course details
            if (!localStorage.getItem('access_token')) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch course details and user's enrollments at the same time
                const [courseRes, enrollmentsRes] = await Promise.all([
                    API.getCourseDetails(id),
                    API.getMyEnrollments()
                ]);

                setCourse(courseRes.data);

                // Check if the current course ID exists in the user's enrollments
                const isUserEnrolled = enrollmentsRes.data.some(
                    enrollment => enrollment.course.id === parseInt(id)
                );
                setIsEnrolled(isUserEnrolled);

            } catch (error) {
                console.error('Error fetching primary course data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrimaryData();
    }, [id]);

    // Effect 2: Fetch protected content (videos/quizzes) ONLY if enrolled
    useEffect(() => {
        const fetchProtectedContent = async () => {
            if (isEnrolled) {
                try {
                    const [videosRes, quizzesRes] = await Promise.all([
                        API.getVideos(id),
                        API.getQuizzes(id)
                    ]);
                    setVideos(videosRes.data);
                    setQuizzes(quizzesRes.data);
                } catch (error) {
                    console.error('Error fetching protected content:', error);
                }
            }
        };

        fetchProtectedContent();
    }, [isEnrolled, id]); // This effect runs when the enrollment status changes

    const handleEnroll = async () => {
        try {
            await API.enrollCourse(id);
            setIsEnrolled(true); // This will trigger the second useEffect to fetch content
            alert('Enrolled successfully!');
        } catch (error) {
            console.error('Error enrolling in course:', error);
            alert('Failed to enroll. You might already be enrolled.');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (!course) return <div>Course not found or you are not logged in.</div>;

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <button onClick={handleEnroll} disabled={isEnrolled}>
                {isEnrolled ? 'Enrolled' : 'Enroll'}
            </button>

            {/* Only show Videos and Quizzes if the user is enrolled */}
            {isEnrolled && (
                <>
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
                </>
            )}
        </div>
    );
};

export default CourseDetails;
