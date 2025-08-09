import axios from 'axios';

// Set the base URL to the root of the server.
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
});

// Interceptor to add the auth token to every request. This part is correct.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Auth Functions ---
// Use the full path from the server root for each request.
export const login = (credentials) => apiClient.post('/api/courses/login/', credentials);
export const register = (userData) => apiClient.post('/api/courses/register/', userData);


// --- API Functions ---
// Use the full path for all other API calls as well.
export const getCourses = () => apiClient.get('/api/courses/courses/');
export const getCourseDetails = (id) => apiClient.get(`/api/courses/courses/${id}/`);
export const getQuizzes = (courseId) => apiClient.get(`/api/courses/quizzes/?course=${courseId}`);
export const getQuizDetails = (id) => apiClient.get(`/api/courses/quizzes/${id}/`);
export const submitQuiz = (quizId, answers) => apiClient.post(`/api/courses/quizzes/${quizId}/submit/`, { answers });
export const getUserProgress = (courseId) => apiClient.get(`/api/courses/progress/${courseId}/`);
export const markLessonComplete = (lessonId) => apiClient.post(`/api/courses/lessons/${lessonId}/complete/`);

export default apiClient;
