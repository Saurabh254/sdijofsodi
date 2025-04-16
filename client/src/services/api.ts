import axios from 'axios';

const API_BASE_URL = 'https://major.saurabhvishwakarma.in/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface CreateExamData {
    title: string;
    description?: string;
    duration: number;
    totalMarks: number;
    startTime: string;
    endTime: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
}

export const createExam = async (examData: CreateExamData) => {
    try {
        const response = await api.post('/exams', examData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to create exam');
        }
        throw error;
    }
};

export default api;