import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    API.get('/progress/')
      .then(res => setProgress(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>My Progress</h1>
      <ul>
        {progress.map(p => (
          <li key={p.id}>
            {p.course} - Score: {p.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
