from fastapi import APIRouter

from app.auth.api import router as auth_router
from app.users.api import router as users_router
from app.exams.api import router as exams_router
from app.faculty.api import router as faculty_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(exams_router, prefix="/exams", tags=["exams"])
router.include_router(faculty_router, prefix="/faculty", tags=["faculty"])
