import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as API from '../services/api';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!localStorage.getItem('access_token')) {
                setIsLoading(false);
                return;
            }

            try {
                const [courseRes, enrollmentsRes] = await Promise.all([
                    API.getCourseDetails(id),
                    API.getMyEnrollments()
                ]);

                const courseData = courseRes.data;
                setCourse(courseData);

                const isUserEnrolled = enrollmentsRes.data.some(
                    enrollment => enrollment.course.id === parseInt(id)
                );
                setIsEnrolled(isUserEnrolled);

                if (isUserEnrolled) {
                    const videosRes = await API.getVideos(id);
                    setVideos(videosRes.data);
                    if (videosRes.data.length > 0) {
                        setSelectedVideo(videosRes.data[0]);
                    }
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
            const videosRes = await API.getVideos(id);
            setVideos(videosRes.data);
            if (videosRes.data.length > 0) {
                setSelectedVideo(videosRes.data[0]);
            }
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

            {isEnrolled && (
                <div className="course-content">
                    <div className="video-player-section">
                        {selectedVideo ? (
                            <div>
                                <h3>{selectedVideo.title}</h3>
                                <video controls autoPlay key={selectedVideo.id} width="100%">
                                    {/* The src now directly uses the full URL from the API */}
                                    <source src={selectedVideo.video_file} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <p>{selectedVideo.description}</p>
                            </div>
                        ) : (
                            <p>Select a video to play.</p>
                        )}
                    </div>

                    <div className="playlist-section">
                        <h2>Videos</h2>
                        <ul>
                            {videos.map(video => (
                                <li key={video.id} onClick={() => setSelectedVideo(video)} className={selectedVideo?.id === video.id ? 'active' : ''}>
                                    {video.title}
                                </li>
                            ))}
                        </ul>

                        <h2>Quizzes</h2>
                        <ul>
                            {course.quizzes && course.quizzes.map(quiz => (
                                <li key={quiz.id}>
                                    <Link to={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
