import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as API from '../services/api';

const HomePage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await API.getCourses();
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div>
            <h1>Available Courses</h1>
            <div className="course-list">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <h2>
                            <Link to={`/courses/${course.id}`}>{course.title}</Link>
                        </h2>
                        <p>{course.description}</p>
                    </div>
                ))}
            </div>
            {/* The duplicate navigation links that were here have been removed */}
        </div>
    );
};

export default HomePage;
