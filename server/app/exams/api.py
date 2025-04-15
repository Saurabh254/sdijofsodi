from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, UTC
import json

from app.database.db import get_db
from app.auth.auth import get_current_faculty, get_current_user
from app.users.models import User
from . import models, schemas

router = APIRouter()


@router.post("/", response_model=schemas.Exam)
def create_exam(
    exam: schemas.ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_faculty),
):
    print(current_user)
    db_exam = models.Exam(
        title=exam.title,
        description=exam.description,
        start_time=exam.start_time,
        end_time=exam.end_time,
        duration_minutes=exam.duration_minutes,
        faculty_id=current_user.id,
    )
    db.add(db_exam)
    db.flush()  # Get the exam ID before committing

    for question in exam.questions:
        db_question = models.Question(
            exam_id=db_exam.id,
            question_text=question.question_text,
            marks=question.marks,
            options=json.dumps(question.options),  # Convert list to JSON string
            correct_answer=question.correct_answer,
        )
        db.add(db_question)

    db.commit()
    db.refresh(db_exam)
    return db_exam


@router.get("/", response_model=List[schemas.Exam])
def get_exams(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    upcoming: bool = False,
    previous: bool = False,
    current_user: User = Depends(get_current_user),
):
    exams = db.query(models.Exam)
    if previous:
        exams = exams.filter(models.Exam.end_time < datetime.now(UTC))
    if upcoming:
        exams = exams.filter(models.Exam.start_time > datetime.now(UTC))
    return exams.offset(skip).limit(limit).all()


@router.get("/{exam_id}", response_model=schemas.Exam)
def get_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam


@router.post("/{exam_id}/submit", response_model=schemas.ExamSubmission)
def submit_exam(
    exam_id: int,
    submission: schemas.ExamSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    if datetime.now(UTC) < exam.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Exam has not started yet"
        )

    if datetime.now(UTC) > exam.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Exam has ended"
        )

    # Check if already submitted
    existing_submission = (
        db.query(models.ExamSubmission)
        .filter(
            models.ExamSubmission.exam_id == exam_id,
            models.ExamSubmission.student_id == current_user.id,
        )
        .first()
    )

    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Exam already submitted"
        )

    # Create submission
    db_submission = models.ExamSubmission(
        exam_id=exam_id,
        student_id=current_user.id,
        submission_time=datetime.now(UTC),
        is_submitted=True,
    )
    db.add(db_submission)
    db.flush()

    total_marks = 0
    for answer in submission.answers:
        question = (
            db.query(models.Question)
            .filter(
                models.Question.id == answer.question_id,
                models.Question.exam_id == exam_id,
            )
            .first()
        )

        if not question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question {answer.question_id} not found in exam",
            )

        marks_obtained = (
            question.marks if answer.answer == question.correct_answer else 0
        )
        total_marks += marks_obtained

        db_answer = models.AnswerSubmission(
            submission_id=db_submission.id,
            question_id=answer.question_id,
            answer=answer.answer,
            marks_obtained=marks_obtained,
        )
        db.add(db_answer)

    db_submission.total_marks = total_marks
    db.commit()
    db.refresh(db_submission)
    return db_submission


@router.get("/{exam_id}/submissions", response_model=List[schemas.ExamSubmission])
def get_exam_submissions(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    if not current_user.is_faculty and current_user.id != exam.faculty_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can view submissions",
        )

    submissions = (
        db.query(models.ExamSubmission)
        .filter(models.ExamSubmission.exam_id == exam_id)
        .all()
    )
    return submissions
