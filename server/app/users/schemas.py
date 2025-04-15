from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    roll_number: str
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    roll_number: str | None = None
