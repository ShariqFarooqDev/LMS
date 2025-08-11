import axios from 'axios';

// ... (existing apiClient setup)
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


export const register = (userData) => apiClient.post('register/', userData);
export const login = async (credentials) => {
    try {
        const response = await apiClient.post('login/', credentials);
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        }
        return response.data;
    } catch (err) {
        logout();
        throw err;
    }
};
export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete apiClient.defaults.headers.common['Authorization'];
};
export const getCourses = () => apiClient.get('courses/');
export const getCourseDetails = (id) => apiClient.get(`courses/${id}/`);
export const enrollCourse = (courseId) => apiClient.post('enroll/', { course_id: courseId });
export const getMyEnrollments = () => apiClient.get('my-enrollments/');
export const getVideos = (courseId) => apiClient.get(`courses/${courseId}/videos/`);
export const getUserProgress = () => apiClient.get('my-progress/');

// New function to get details for a specific quiz
export const getQuizDetails = (quizId) => apiClient.get(`quizzes/${quizId}/`);

// Updated function to send answers in the correct format
export const submitQuiz = (quizId, answers) => {
    // The backend expects the answers in a nested object
    return apiClient.post(`quizzes/${quizId}/submit/`, { answers });
};
