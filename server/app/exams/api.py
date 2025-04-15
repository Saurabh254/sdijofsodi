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


@router.post("", response_model=schemas.Exam)
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


@router.get("/results", response_model=List[schemas.ExamWithSubmissions])
def get_exam_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all exams with their submissions for the current faculty"""
    if current_user.is_faculty:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can view exam results",
        )

    # Get all exams created by the faculty
    exams = (
        db.query(models.Exam).filter(models.Exam.faculty_id == current_user.id).all()
    )

    result = []
    for exam in exams:
        # Get all submissions for this exam
        submissions = (
            db.query(models.ExamSubmission)
            .filter(models.ExamSubmission.exam_id == exam.id)
            .all()
        )

        # Get student names for each submission
        submissions_with_names = []
        for submission in submissions:
            student = db.query(User).filter(User.id == submission.student_id).first()
            submissions_with_names.append(
                {
                    "id": submission.id,
                    "exam_id": submission.exam_id,
                    "student_id": submission.student_id,
                    "student_name": f"{student.first_name} {student.last_name}",
                    "submission_time": submission.submission_time,
                    "total_marks": submission.total_marks,
                    "is_submitted": submission.is_submitted,
                }
            )

        result.append(
            {
                "id": exam.id,
                "title": exam.title,
                "total_marks": sum(q.marks for q in exam.questions),
                "submissions": submissions_with_names,
            }
        )

    return result


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


@router.get("", response_model=List[schemas.Exam])
def get_exams(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    upcoming: bool = False,
    attempted: bool = False,
    previous: bool = False,
    current_user: User = Depends(get_current_user),
):
    exams = db.query(models.Exam)
    if previous:
        exams = exams.filter(models.Exam.end_time < datetime.now(UTC))
    if upcoming:
        exams = exams.filter(models.Exam.start_time > datetime.now(UTC))
    if attempted:
        exams = exams.filter(
            models.ExamSubmission.student_id == current_user.id,
            models.ExamSubmission.status == "completed",
        )
    return exams.offset(skip).limit(limit).all()


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

    if datetime.now(UTC) < exam.start_time.replace(tzinfo=UTC):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Exam has not started yet"
        )

    if datetime.now(UTC) > exam.end_time.replace(tzinfo=UTC):
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
    if not isinstance(submission.answers.model_dump(), dict):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid format for answers. Expected a dictionary.",
        )

    question_id = submission.answers.question_id
    student_answer = submission.answers.answer

    if not question_id or student_answer is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both 'question_id' and 'answer' must be provided in answers.",
        )

    question = (
        db.query(models.Question)
        .filter(
            models.Question.id == question_id,
            models.Question.exam_id == exam_id,
        )
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Question {question_id} not found in exam",
        )

    marks_obtained = question.marks if student_answer == question.correct_answer else 0
    total_marks += marks_obtained
    print(
        "Marks obtained:",
        marks_obtained,
        "Total marks:",
        total_marks,
        "Question ID:",
        question_id,
    )
    db_answer = models.AnswerSubmission(
        submission_id=db_submission.id,
        question_id=int(question_id),
        answer=student_answer,
        marks_obtained=marks_obtained,
    )
    db.add(db_answer)

    db_submission.total_marks = int(total_marks)
    exam.status = "completed" if total_marks >= 0 else "failed"
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


@router.get(
    "/{exam_id}/submissions/{submission_id}", response_model=schemas.SubmissionDetails
)
def get_submission_details(
    exam_id: int,
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get detailed information about a specific submission"""
    if current_user.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can view submission details",
        )

    # Verify the exam exists and belongs to the faculty
    exam = (
        db.query(models.Exam)
        .filter(models.Exam.id == exam_id, models.Exam.faculty_id == current_user.id)
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found"
        )

    # Get the submission
    submission = (
        db.query(models.ExamSubmission)
        .filter(
            models.ExamSubmission.id == submission_id,
            models.ExamSubmission.exam_id == exam_id,
        )
        .first()
    )

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found"
        )

    # Get student details
    student = db.query(User).filter(User.id == submission.student_id).first()

    # Get all answers for this submission
    answers = (
        db.query(models.AnswerSubmission, models.Question)
        .join(
            models.Question, models.AnswerSubmission.question_id == models.Question.id
        )
        .filter(models.AnswerSubmission.submission_id == submission_id)
        .all()
    )

    # Format the answers
    formatted_answers = []
    for answer, question in answers:
        formatted_answers.append(
            {
                "question_id": question.id,
                "question_text": question.text,
                "correct_answer": question.correct_answer,
                "student_answer": answer.answer,
                "marks_obtained": answer.marks_obtained,
                "total_marks": question.marks,
            }
        )

    return {
        "id": submission.id,
        "exam_id": submission.exam_id,
        "exam_title": exam.title,
        "student_name": f"{student.first_name} {student.last_name}",
        "submission_time": submission.submission_time,
        "total_marks": sum(q.marks for q in exam.questions),
        "marks_obtained": submission.total_marks,
        "answers": formatted_answers,
    }


@router.get("/{exam_id}/analytics", response_model=schemas.ExamAnalytics)
def get_exam_analytics(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get analytics for a specific exam"""
    if current_user.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can view exam analytics",
        )

    # Verify the exam exists and belongs to the faculty
    exam = (
        db.query(models.Exam)
        .filter(models.Exam.id == exam_id, models.Exam.faculty_id == current_user.id)
        .first()
    )

    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found"
        )

    # Get all submissions for this exam
    submissions = (
        db.query(models.ExamSubmission)
        .filter(models.ExamSubmission.exam_id == exam_id)
        .all()
    )

    # Calculate statistics
    total_submissions = len(submissions)
    if total_submissions == 0:
        return {
            "exam_id": exam_id,
            "total_submissions": 0,
            "average_marks": 0,
            "highest_marks": 0,
            "lowest_marks": 0,
            "pass_percentage": 0,
            "question_wise_analysis": [],
        }

    marks = [sub.total_marks for sub in submissions]
    average_marks = sum(marks) / total_submissions
    highest_marks = max(marks)
    lowest_marks = min(marks)

    # Calculate pass percentage (assuming 40% is passing)
    passing_marks = sum(q.marks for q in exam.questions) * 0.4
    pass_count = sum(1 for mark in marks if mark >= passing_marks)
    pass_percentage = (pass_count / total_submissions) * 100

    # Get question-wise analysis
    question_analysis = []
    for question in exam.questions:
        correct_answers = (
            db.query(models.AnswerSubmission)
            .filter(
                models.AnswerSubmission.question_id == question.id,
                models.AnswerSubmission.answer == question.correct_answer,
            )
            .count()
        )
        question_analysis.append(
            {
                "question_id": question.id,
                "question_text": question.text,
                "correct_answers": correct_answers,
                "total_attempts": total_submissions,
                "correct_percentage": (correct_answers / total_submissions) * 100,
            }
        )

    return {
        "exam_id": exam_id,
        "total_submissions": total_submissions,
        "average_marks": average_marks,
        "highest_marks": highest_marks,
        "lowest_marks": lowest_marks,
        "pass_percentage": pass_percentage,
        "question_wise_analysis": question_analysis,
    }
