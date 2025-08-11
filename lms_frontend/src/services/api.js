import axios from 'axios';

// Create an Axios instance with a base URL.
// This makes it easier to manage API endpoints.
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Use an interceptor to automatically add the JWT token to every request
// if it exists in localStorage.
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Add the 'Bearer' prefix, which is standard for JWT
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Function to handle user registration
export const register = (userData) => {
    return apiClient.post('register/', userData);
};

// Function to handle user login
export const login = async (credentials) => {
    try {
        const response = await apiClient.post('login/', credentials);
        // If login is successful, store the tokens
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // Set the authorization header for all subsequent requests with this apiClient instance
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        }
        return response.data;
    } catch (err) {
        // Log out in case of an error to clear any stale tokens
        logout();
        throw err;
    }
};

// Function to handle user logout
export const logout = () => {
    // Remove tokens from storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Remove the authorization header
    delete apiClient.defaults.headers.common['Authorization'];
};


// --- Course and other API functions ---

export const getCourses = () => {
    return apiClient.get('courses/');
};

export const getCourseDetails = (id) => {
    return apiClient.get(`courses/${id}/`);
};

export const enrollCourse = (courseId) => {
    // The backend expects 'course_id' in the request body
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
