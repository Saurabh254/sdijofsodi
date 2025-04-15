# Examination System Backend

A comprehensive examination system backend built with FastAPI, SQLAlchemy, and JWT authentication.

## Features

- User authentication with JWT
- Role-based access control (Admin/Student)
- User registration and management
- Secure password hashing
- Database migrations with Alembic

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up the database:
```bash
alembic upgrade head
```

4. Run the development server:
```bash
uvicorn main:app --reload
```

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication

The API uses JWT authentication. To authenticate:

1. Register a new user at `/api/users/register`
2. Get an access token at `/api/auth/token` using your roll number and password
3. Use the token in the Authorization header: `Bearer <token>`

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./examination.db
```

## Development

- Run tests: `pytest`
- Create new migration: `alembic revision --autogenerate -m "description"`
- Apply migrations: `alembic upgrade head`