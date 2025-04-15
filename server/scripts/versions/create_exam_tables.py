"""create exam tables

Revision ID: create_exam_tables
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "create_exam_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_faculty column to users table
    op.add_column(
        "users",
        sa.Column("is_faculty", sa.Boolean(), nullable=False, server_default="false"),
    )

    # Create exams table
    op.create_table(
        "exams",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("start_time", sa.DateTime(), nullable=False),
        sa.Column("end_time", sa.DateTime(), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("faculty_id", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.ForeignKeyConstraint(
            ["faculty_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create questions table
    op.create_table(
        "questions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("exam_id", sa.Integer(), nullable=False),
        sa.Column("question_text", sa.Text(), nullable=False),
        sa.Column("marks", sa.Integer(), nullable=False),
        sa.Column("options", sa.Text(), nullable=False),
        sa.Column("correct_answer", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["exam_id"],
            ["exams.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create exam_submissions table
    op.create_table(
        "exam_submissions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("exam_id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("submission_time", sa.DateTime(), nullable=False),
        sa.Column("total_marks", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_submitted", sa.Boolean(), nullable=False, server_default="false"),
        sa.ForeignKeyConstraint(
            ["exam_id"],
            ["exams.id"],
        ),
        sa.ForeignKeyConstraint(
            ["student_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create answer_submissions table
    op.create_table(
        "answer_submissions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("submission_id", sa.Integer(), nullable=False),
        sa.Column("question_id", sa.Integer(), nullable=False),
        sa.Column("answer", sa.String(), nullable=False),
        sa.Column("marks_obtained", sa.Integer(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(
            ["submission_id"],
            ["exam_submissions.id"],
        ),
        sa.ForeignKeyConstraint(
            ["question_id"],
            ["questions.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("answer_submissions")
    op.drop_table("exam_submissions")
    op.drop_table("questions")
    op.drop_table("exams")
    op.drop_column("users", "is_faculty")
