from datetime import UTC, datetime
from turtle import update
from sqlalchemy import (
    ARRAY,
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from app.database.db import Base
from sqlalchemy.orm import Mapped, mapped_column


class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    start_time: Mapped[DateTime] = mapped_column(DateTime)
    end_time: Mapped[DateTime] = mapped_column(DateTime)
    duration_minutes = Column(Integer)
    faculty_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")
    is_active = Column(Boolean, default=True)
    total_marks = Column(Integer, default=0)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.now(UTC))
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )
    # Relationships
    faculty = relationship("User", back_populates="created_exams")
    questions = relationship("Question", back_populates="exam")
    submissions = relationship("ExamSubmission", back_populates="exam")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    question_text = Column(Text)
    marks = Column(Integer)
    options = Column(Text)  # JSON string of options
    correct_answer = Column(String)

    # Relationships
    exam = relationship("Exam", back_populates="questions")
    submissions = relationship("AnswerSubmission", back_populates="question")


class ExamSubmission(Base):
    __tablename__ = "exam_submissions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    submission_time = Column(DateTime)
    total_marks = Column(Integer, default=0)
    is_submitted = Column(Boolean, default=False)

    # Relationships
    exam = relationship("Exam", back_populates="submissions")
    student = relationship("User", back_populates="exam_submissions")
    answers = relationship("AnswerSubmission", back_populates="submission")


class AnswerSubmission(Base):
    __tablename__ = "answer_submissions"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("exam_submissions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer = Column(String)
    marks_obtained = Column(Integer, default=0)

    # Relationships
    submission = relationship("ExamSubmission", back_populates="answers")
    question = relationship("Question", back_populates="submissions")
