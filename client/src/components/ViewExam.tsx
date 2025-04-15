import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api_client from "../api_client";
import { toast } from "react-hot-toast";
import Header from "./Header";
import { RiArrowLeftLine } from "@remixicon/react";

interface Question {
  question_text: string;
  marks: number;
  options: string[];
  correct_answer: string;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  faculty_id: number;
  is_active: boolean;
  questions: Question[];
}

const ViewExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await api_client.get<Exam>(`/exams/${examId}`);
        setExam(response.data);
      } catch (error) {
        toast.error("Failed to fetch exam details");
        console.error("Error fetching exam:", error);
        navigate("/teacher/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateTotalMarks = (questions: Question[]) => {
    return questions.reduce((total, question) => total + question.marks, 0);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </>
    );
  }

  if (!exam) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Exam not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6 mt-20">
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white cursor-pointer rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Exam Details */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6 border-1 border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Exam Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-1 border-slate-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-gray-900">{exam.description}</p>
              </div>
              <div className="border-1 border-slate-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <p className="mt-1 text-gray-900">
                  {exam.duration_minutes} Minutes
                </p>
              </div>
              <div className="border-1 border-slate-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <p className="mt-1 text-gray-900">
                  {formatDate(exam.start_time)} at {formatTime(exam.start_time)}
                </p>
              </div>
              <div className="border-1 border-slate-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <p className="mt-1 text-gray-900">
                  {formatDate(exam.end_time)} at {formatTime(exam.end_time)}
                </p>
              </div>
              <div className="border-1 border-slate-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700">
                  Total Marks
                </label>
                <p className="mt-1 text-gray-900">
                  {calculateTotalMarks(exam.questions)}
                </p>
              </div>
              <div className="border-1 border-slate-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1 text-gray-900">
                  {exam.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Questions</h2>
            {exam.questions.map((question, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md space-y-4 border-1 border-slate-100"
              >
                <div className="flex justify-between items-center border-1 border-slate-100 p-4 rounded-md">
                  <h3 className="text-md font-medium">Question {index + 1}</h3>
                  <span className="text-sm text-gray-500">
                    {question.marks} marks
                  </span>
                </div>

                <div className="border-1 border-slate-100 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">
                    Question Text
                  </label>
                  <p className="mt-1 text-gray-900">{question.question_text}</p>
                </div>

                <div className="border-1 border-slate-100 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <ul className="mt-1 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <li
                        key={optionIndex}
                        className={`p-2 rounded-md border-1 border-slate-100 ${
                          option === question.correct_answer
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-50"
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-1 border-slate-100 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">
                    Correct Answer
                  </label>
                  <p className="mt-1 text-gray-900">
                    {question.correct_answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewExam;
