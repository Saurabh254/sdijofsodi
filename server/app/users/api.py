from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.auth.auth import get_password_hash, get_current_user
from . import models, schemas

router = APIRouter()


@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = (
        db.query(models.User)
        .filter(models.User.roll_number == user.roll_number)
        .first()
    )
    if db_user:
        raise HTTPException(status_code=400, detail="Roll number already registered")

    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        roll_number=user.roll_number,
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[schemas.User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    users = (
        db.query(models.User)
        .filter(models.User.is_faculty.is_(False))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return users
