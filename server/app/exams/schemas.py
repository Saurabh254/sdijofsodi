from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import json


class QuestionBase(BaseModel):
    question_text: str
    marks: int
    options: List[str]
    correct_answer: str


class QuestionCreate(QuestionBase):
    pass


class QuestionResponse(BaseModel):
    question_text: str
    marks: int
    correct_answer: str
    id: int
    exam_id: int
    options: list[str]

    @validator("options", pre=True)
    def parse_options(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return v
        return v

    class Config:
        from_attributes = True


class Question(QuestionBase):
    id: int
    exam_id: int

    @classmethod
    def from_orm(cls, obj):
        # Convert the JSON string back to a list
        if isinstance(obj.options, str):
            obj.options = json.loads(obj.options)
        return super().from_orm(obj)

    class Config:
        from_attributes = True


class ExamBase(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    duration_minutes: int


class ExamCreate(ExamBase):
    questions: List[QuestionCreate]


class Exam(ExamBase):
    id: int
    faculty_id: int
    is_active: bool
    status: str
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True


class AnswerSubmissionBase(BaseModel):
    question_id: int
    answer: str


class ExamSubmissionCreate(BaseModel):
    exam_id: int
    answers: AnswerSubmissionBase


class AnswerSubmission(AnswerSubmissionBase):
    id: int
    submission_id: int
    marks_obtained: int

    class Config:
        from_attributes = True


class ExamSubmissionBase(BaseModel):
    exam_id: int
    student_id: int
    submission_time: datetime
    total_marks: int
    is_submitted: bool


class ExamSubmission(ExamSubmissionBase):
    id: int

    class Config:
        from_attributes = True


class ExamWithSubmissions(BaseModel):
    id: int
    title: str
    total_marks: int
    submissions: List[ExamSubmission]

    class Config:
        from_attributes = True


class AnswerSubmissionDetail(BaseModel):
    question_id: int
    question_text: str
    correct_answer: str
    student_answer: str
    marks_obtained: int
    total_marks: int

    class Config:
        from_attributes = True


class SubmissionDetails(BaseModel):
    id: int
    exam_id: int
    exam_title: str
    student_name: str
    submission_time: datetime
    total_marks: int
    marks_obtained: int
    answers: List[AnswerSubmissionDetail]

    class Config:
        from_attributes = True


class QuestionAnalysis(BaseModel):
    question_id: int
    question_text: str
    correct_answers: int
    total_attempts: int
    correct_percentage: float

    class Config:
        from_attributes = True


class ExamAnalytics(BaseModel):
    exam_id: int
    total_submissions: int
    average_marks: float
    highest_marks: int
    lowest_marks: int
    pass_percentage: float
    question_wise_analysis: List[QuestionAnalysis]

    class Config:
        from_attributes = True
