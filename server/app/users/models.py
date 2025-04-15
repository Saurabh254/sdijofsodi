from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_faculty = Column(Boolean, default=False)
    branch = Column(String, nullable=True)
    semester = Column(String, nullable=True, default="cse")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    created_exams = relationship("Exam", back_populates="faculty")
    exam_submissions = relationship("ExamSubmission", back_populates="student")
