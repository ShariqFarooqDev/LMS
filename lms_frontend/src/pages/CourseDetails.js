import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as API from '../services/api';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // This effect now handles all data fetching for the page
    useEffect(() => {
        const fetchCourseData = async () => {
            if (!localStorage.getItem('access_token')) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch the main course details and the user's enrollments
                const [courseRes, enrollmentsRes] = await Promise.all([
                    API.getCourseDetails(id),
                    API.getMyEnrollments()
                ]);

                const courseData = courseRes.data;
                setCourse(courseData);

                // Check if the user is enrolled in this specific course
                const isUserEnrolled = enrollmentsRes.data.some(
                    enrollment => enrollment.course.id === parseInt(id)
                );
                setIsEnrolled(isUserEnrolled);

                // If the user is enrolled, fetch the protected video content
                if (isUserEnrolled) {
                    const videosRes = await API.getVideos(id);
                    setVideos(videosRes.data);
                }

            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleEnroll = async () => {
        try {
            await API.enrollCourse(id);
            setIsEnrolled(true);
            // After enrolling, fetch the videos immediately so they appear
            const videosRes = await API.getVideos(id);
            setVideos(videosRes.data);
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

            {/* Only show the Videos and Quizzes sections if the user is enrolled */}
            {isEnrolled && (
                <>
                    <h2>Videos</h2>
                    <ul>
                        {videos.map(video => (
                            <li key={video.id}>{video.title}</li>
                        ))}
                    </ul>

                    <h2>Quizzes</h2>
                    {/* The list of quizzes now comes directly from the course object */}
                    <ul>
                        {course.quizzes && course.quizzes.map(quiz => (
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
