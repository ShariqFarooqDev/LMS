import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get('/courses/')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Available Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
}
