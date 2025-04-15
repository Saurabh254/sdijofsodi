from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class FacultyBase(BaseModel):
    email: EmailStr
    name: str


class FacultyCreate(FacultyBase):
    password: str


class Faculty(FacultyBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class FacultyLogin(BaseModel):
    email: EmailStr
    password: str


class StudentCreate(BaseModel):
    roll_number: str
    name: str
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
