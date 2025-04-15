import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api_client from "../api_client";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface AnswerSubmission {
  question_id: number;
  question_text: string;
  correct_answer: string;
  student_answer: string;
  marks_obtained: number;
  total_marks: number;
}

interface SubmissionDetails {
  id: number;
  exam_id: number;
  exam_title: string;
  student_name: string;
  submission_time: string;
  total_marks: number;
  marks_obtained: number;
  answers: AnswerSubmission[];
}

const SubmissionDetails = () => {
  const { examId, submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await api_client.get<SubmissionDetails>(
          `/exams/${examId}/submissions/${submissionId}`
        );
        setSubmission(response.data);
      } catch (error) {
        console.error("Error fetching submission details:", error);
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.detail || "Failed to load submission details"
          );
        } else {
          toast.error("Failed to load submission details");
        }
        navigate("/teacher/results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [examId, submissionId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Submission Details
            </h1>
            <p className="text-gray-600 mt-2">Exam: {submission.exam_title}</p>
            <p className="text-gray-600">Student: {submission.student_name}</p>
          </div>
          <button
            onClick={() => navigate("/teacher/results")}
            className="btn text-white font-semibold py-2 px-4 rounded-xl bg-gray-600 hover:bg-gray-700 transition duration-200"
          >
            Back to Results
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-1 border-slate-100">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Submission Time</p>
              <p className="font-medium">
                {new Date(submission.submission_time).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Marks</p>
              <p className="font-medium">
                {submission.marks_obtained} / {submission.total_marks}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {submission.answers.map((answer, index) => (
            <div
              key={answer.question_id}
              className="bg-white rounded-lg shadow-md p-6 border-1 border-slate-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Question {index + 1}
                </h3>
                <span className="text-sm text-gray-500">
                  {answer.marks_obtained} / {answer.total_marks} marks
                </span>
              </div>
              <p className="text-gray-700 mb-4">{answer.question_text}</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Correct Answer</p>
                  <p className="font-medium text-green-600">
                    {answer.correct_answer}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student's Answer</p>
                  <p
                    className={`font-medium ${
                      answer.student_answer === answer.correct_answer
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {answer.student_answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
