import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api_client from "../api_client";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface ExamSubmission {
  id: number;
  exam_id: number;
  student_id: number;
  student_name: string;
  submission_time: string;
  total_marks: number;
  is_submitted: boolean;
}

interface Exam {
  id: number;
  title: string;
  total_marks: number;
  submissions: ExamSubmission[];
}

const ExamResults = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api_client.get<Exam[]>("/exams/results");
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exam results:", error);
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.detail || "Failed to load exam results"
          );
        } else {
          toast.error("Failed to load exam results");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateAverage = (submissions: ExamSubmission[]) => {
    if (submissions.length === 0) return 0;
    const total = submissions.reduce((sum, sub) => sum + sub.total_marks, 0);
    return (total / submissions.length).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="btn text-white font-semibold py-2 px-4 rounded-xl bg-gray-600 hover:bg-gray-700 transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600">
              No exam results available
            </h2>
            <p className="mt-2 text-gray-500">
              Results will appear here once students submit their exams
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-md p-6 border-1 border-slate-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {exam.title}
                    </h2>
                    <p className="text-gray-600">
                      Total Marks: {exam.total_marks}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">
                      Attempts: {exam.submissions.length}
                    </p>
                    <p className="text-gray-600">
                      Average: {calculateAverage(exam.submissions)} /{" "}
                      {exam.total_marks}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submission Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks Obtained
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exam.submissions.map((submission) => (
                        <tr key={submission.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(submission.submission_time)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.total_marks} / {exam.total_marks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                submission.is_submitted
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {submission.is_submitted
                                ? "Submitted"
                                : "In Progress"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() =>
                                navigate(
                                  `/teacher/exam/${exam.id}/submission/${submission.id}`
                                )
                              }
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResults;
