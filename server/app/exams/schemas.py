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
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True


class AnswerSubmissionBase(BaseModel):
    question_id: int
    answer: str


class ExamSubmissionCreate(BaseModel):
    exam_id: int
    answers: List[AnswerSubmissionBase]


class AnswerSubmission(AnswerSubmissionBase):
    id: int
    submission_id: int
    marks_obtained: int

    class Config:
        from_attributes = True


class ExamSubmission(BaseModel):
    id: int
    exam_id: int
    student_id: int
    submission_time: datetime
    total_marks: int
    is_submitted: bool
    answers: List[AnswerSubmission]

    class Config:
        from_attributes = True
