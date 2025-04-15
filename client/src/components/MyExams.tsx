import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api_client from "../api_client";
import toast from "react-hot-toast";
import Header from "./Header";
import { Paper, Typography } from "@mui/material";

interface Exam {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  faculty_id: number;
  is_active: boolean;
  questions: {
    question_text: string;
    marks: number;
    correct_answer: string;
    id: number;
    exam_id: number;
    options: string[];
  }[];
}

const MyExams: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api_client.get<Exam[]>("/exams");
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("Failed to load exams");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const startTime = new Date(exam.start_time);
    const endTime = new Date(exam.end_time);

    if (now < startTime) return "upcoming";
    if (now > endTime) return "completed";
    return "in_progress";
  };

  const filteredExams = exams.filter((exam) => {
    const status = getExamStatus(exam);
    return activeTab === "upcoming"
      ? status === "upcoming"
      : status === "completed";
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-medium text-gray-900">My Exams</h1>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`${
                      activeTab === "upcoming"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Upcoming Exams
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`${
                      activeTab === "completed"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Completed Exams
                  </button>
                </nav>
              </div>
            </div>

            {filteredExams.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-600">
                  No {activeTab} exams available
                </h2>
                <p className="mt-2 text-gray-500">
                  {activeTab === "upcoming"
                    ? "You don't have any upcoming exams"
                    : "You haven't completed any exams yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExams.map((exam) => (
                  <Paper
                    key={exam.id}
                    className="bg-white border border-gray-200 p-6 hover:border-gray-300 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Typography variant="h6" className="text-gray-900">
                          {exam.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-500 mt-1"
                        >
                          {exam.description}
                        </Typography>
                      </div>
                      <div className="text-right">
                        {activeTab === "completed" ? (
                          <span className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                            Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm font-semibold text-yellow-600 bg-yellow-100 rounded-full">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <div>Duration: {exam.duration_minutes} minutes</div>
                      <div>Start: {formatDate(exam.start_time)}</div>
                    </div>
                    {activeTab === "upcoming" && (
                      <div className="mt-4">
                        <button
                          disabled={true}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                          Not started
                        </button>
                      </div>
                    )}
                  </Paper>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyExams;
