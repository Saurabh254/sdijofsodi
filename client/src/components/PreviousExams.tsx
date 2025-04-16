import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api_client from "../api_client";
import { toast } from "react-hot-toast";
import Header from "./Header";
import Exam from "../pages/Exam";
import ExamCard from "./ExamCard";

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

const PreviousExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api_client.get<Exam[]>("/exams?previous=true");
        console.log("Raw API response:", response.data);

        setExams(response.data);
      } catch (error) {
        console.error("Error details:", error);
        toast.error("Failed to fetch previous exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="px-24 mx-auto p-6">
          <div className="flex justify-between items-center mb-6 mt-20">
            <h1 className="text-2xl font-bold">Previous Exams</h1>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : exams.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md border-1 border-slate-100 text-center">
              <p className="text-gray-500">No previous exams found</p>
            </div>
          ) : (
            <div className="space-y-6 columns-2 lg:columns-3 gap-6">
              {exams.map((exam) => (
                <Link to={`/teacher/exam/${exam.id}/submissions`} key={exam.id}>
                  <ExamCard exam={exam} isTeacher={true} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PreviousExams;
