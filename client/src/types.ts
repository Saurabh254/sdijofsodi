interface Question {
    id: number;
    exam_id: number;
    question_text: string;
    marks: number;
    correct_answer: string;
    options: string[];
}

export interface Exam {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status: string;
    duration_minutes: number;
    faculty_id: number;
    is_active: boolean;
    questions: Question[];
}

export interface Student {
    id: number;
    name: string;
    email: string;
    roll_number: string;
    branch: string;
    semester: number;
}
