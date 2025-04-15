import api from '../api_client';

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Exam {
    id: string;
    title: string;
    subject: string;
    description: string;
    duration: number;
    totalMarks: number;
    date: string;
    startTime: string;
    endTime: string;
    class: string;
    status: string;
    questions?: Question[];
}

export interface ExamSubmission {
    answers: {
        questionId: string;
        answer: number;
    }[];
}

export interface ExamResult {
    score: number;
    totalMarks: number;
    percentage: string;
}

export const getExams = async (): Promise<Exam[]> => {
    const response = await api.get<Exam[]>('/exams');
    return response.data;
};

export const getExamById = async (id: string): Promise<Exam> => {
    const response = await api.get<Exam>(`/exams/${id}`);
    return response.data;
};

export const createExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
    const response = await api.post<Exam>('/exams', examData);
    return response.data;
};

export const submitExam = async (examId: string, submission: ExamSubmission): Promise<ExamResult> => {
    const response = await api.post<ExamResult>(`/exams/${examId}/submit`, submission);
    return response.data;
};

export const getStudentResults = async (): Promise<ExamResult[]> => {
    const response = await api.get<ExamResult[]>('/exams/results');
    return response.data;
};