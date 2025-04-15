from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt

from app.database.db import get_db
from app.users.models import User
from app.auth.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
)
from app.config import settings
from . import schemas

router = APIRouter()


@router.post("/signup", response_model=schemas.Faculty)
def create_faculty(
    faculty: schemas.FacultyCreate,
    db: Session = Depends(get_db),
):
    # Check if email already exists
    db_faculty = db.query(User).filter(User.email == faculty.email).first()
    if db_faculty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new faculty user
    db_faculty = User(
        email=faculty.email,
        name=faculty.name,
        hashed_password=get_password_hash(faculty.password),
        is_faculty=True,
        created_at=datetime.utcnow(),
    )
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty


@router.post("/login", response_model=schemas.Token)
def login_faculty(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # Verify faculty credentials
    faculty = db.query(User).filter(User.email == form_data.username).first()
    if not faculty or not bool(faculty.is_faculty):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(form_data.password, str(faculty.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": faculty.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register-student", response_model=schemas.StudentCreate)
def register_student(
    student: schemas.StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not bool(current_user.is_faculty):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can register students",
        )

    # Check if email or roll number already exists
    db_student = (
        db.query(User)
        .filter(
            (User.email == student.email) | (User.roll_number == student.roll_number)
        )
        .first()
    )
    if db_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or roll number already registered",
        )

    # Create new student
    db_student = User(
        roll_number=student.roll_number,
        email=student.email,
        name=student.name,
        hashed_password=get_password_hash(student.password),
        is_faculty=False,
        created_at=datetime.utcnow(),
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student
