import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api_client from "../api_client";
import toast from "react-hot-toast";
import Header from "../components/Header";

interface ExamSubmission {
  exam_id: number;
  student_id: number;
  submission_time: string;
  total_marks: number;
  is_submitted: boolean;
  id: number;
}

const ExamSubmissionPage = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api_client.get("/exam-submissions");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast.error("Failed to load exam submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-base-content">
            Exam Submissions
          </h1>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Submission ID</th>
                    <th>Exam ID</th>
                    <th>Student ID</th>
                    <th>Submission Time</th>
                    <th>Total Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover">
                      <td>{submission.id}</td>
                      <td>{submission.exam_id}</td>
                      <td>{submission.student_id}</td>
                      <td>{formatDate(submission.submission_time)}</td>
                      <td>{submission.total_marks}</td>
                      <td>
                        <span
                          className={`badge ${
                            submission.is_submitted
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {submission.is_submitted ? "Submitted" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {submissions.length === 0 && (
              <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-lg text-base-content">
                  No exam submissions found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSubmissionPage;
