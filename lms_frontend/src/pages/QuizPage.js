import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    API.get(`/quizzes/${id}/`)
      .then(res => setQuiz(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const submitAnswer = () => {
    if (answer.trim().toLowerCase() === quiz.answer.trim().toLowerCase()) {
      setResult('✅ Correct!');
    } else {
      setResult('❌ Wrong, try again.');
    }
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div>
      <h1>Quiz</h1>
      <p>{quiz.question}</p>
      <input value={answer} onChange={e => setAnswer(e.target.value)} />
      <button onClick={submitAnswer}>Submit</button>
      {result && <p>{result}</p>}
    </div>
  );
}
