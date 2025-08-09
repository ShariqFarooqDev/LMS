import axios from 'axios';

const API_URL = 'http://localhost:8000/api/courses/'; // Your Django API base URL

const apiClient = axios.create({
    baseURL: API_URL,
});

// Interceptor to add the auth token to every request
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
export const login = (credentials) => apiClient.post('login/', credentials);
export const register = (userData) => apiClient.post('register/', userData);


// --- Keep your existing API functions ---
export const getCourses = () => apiClient.get('courses/');
export const getCourseDetails = (id) => apiClient.get(`courses/${id}/`);
export const getQuizzes = (courseId) => apiClient.get(`quizzes/?course=${courseId}`);
export const getQuizDetails = (id) => apiClient.get(`quizzes/${id}/`);
export const submitQuiz = (quizId, answers) => apiClient.post(`quizzes/${quizId}/submit/`, { answers });
export const getUserProgress = (courseId) => apiClient.get(`progress/${courseId}/`);
export const markLessonComplete = (lessonId) => apiClient.post(`lessons/${lessonId}/complete/`);

export default apiClient;
