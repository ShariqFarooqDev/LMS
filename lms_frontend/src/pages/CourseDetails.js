import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}/`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <h3>Videos</h3>
      <ul>
        {course.videos.map(video => (
          <li key={video.id}>
            <a href={video.video_url} target="_blank" rel="noreferrer">{video.title}</a>
          </li>
        ))}
      </ul>

      <h3>Quizzes</h3>
      <ul>
        {course.quizzes.map(quiz => (
          <li key={quiz.id}>
            <Link to={`/quiz/${quiz.id}`}>{quiz.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
