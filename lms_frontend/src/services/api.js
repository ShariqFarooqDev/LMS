import axios from 'axios';

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

export const register = (userData) => {
    return apiClient.post('register/', userData);
};

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

export const getCourses = () => {
    return apiClient.get('courses/');
};

export const getCourseDetails = (id) => {
    return apiClient.get(`courses/${id}/`);
};

export const enrollCourse = (courseId) => {
    return apiClient.post('enroll/', { course_id: courseId });
};

export const getMyEnrollments = () => {
    return apiClient.get('my-enrollments/');
};

export const getVideos = (courseId) => {
    return apiClient.get(`courses/${courseId}/videos/`);
};

export const getQuizzes = (courseId) => {
    return apiClient.get(`courses/${courseId}/quizzes/`);
};

export const submitQuiz = (quizId, answers) => {
    return apiClient.post(`quizzes/${quizId}/submit/`, { answers });
};

// New function to get user progress
export const getUserProgress = () => {
    return apiClient.get('my-progress/');
};
