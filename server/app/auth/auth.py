from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.config import settings
from app.database.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.users.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15000)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        roll_number: str = payload.get("sub")
        if roll_number is None:
            raise credentials_exception
    except JWTError as e:
        print(e)
        raise credentials_exception

    user = (
        db.query(User)
        .filter(or_(User.roll_number == roll_number, User.email == roll_number))
        .first()
    )
    if user is None:
        raise credentials_exception
    return user


async def get_current_faculty(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_faculty:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty members can access this resource",
        )
    return current_user
