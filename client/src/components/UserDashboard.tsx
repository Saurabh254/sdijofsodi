import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Exam } from "../types";
import api_client from "../api_client";
import toast from "react-hot-toast";
import ExamCard from "./ExamCard";
import Header from "./Header";
import { Paper, Typography, Card, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ExamResult {
  id: number;
  title: string;
  subject: string;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  date: string;
}

interface PerformanceMetrics {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  totalExams: number;
  subjectWisePerformance: {
    subject: string;
    averageScore: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api_client.get<Exam[]>("/exams");
        const now = new Date();
        const activeExams = response.data.filter((exam) => {
          const endTime = new Date(exam.end_time);
          return exam.is_active && now < endTime;
        });
        setExams(activeExams);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("Failed to load exams");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchResults = async () => {
      try {
        const response = await api_client.get<ExamResult[]>("/exams/results");
        calculateMetrics(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchExams();
    fetchResults();
  }, []);

  const calculateMetrics = (examResults: ExamResult[]) => {
    if (examResults.length === 0) return;

    const totalExams = examResults.length;
    const totalScore = examResults.reduce(
      (sum, result) => sum + result.percentage,
      0
    );
    const averageScore = totalScore / totalExams;
    const highestScore = Math.max(
      ...examResults.map((result) => result.percentage)
    );
    const lowestScore = Math.min(
      ...examResults.map((result) => result.percentage)
    );
    const passRate =
      (examResults.filter((result) => result.percentage >= 40).length /
        totalExams) *
      100;

    // Calculate subject-wise performance
    const subjectMap = new Map<string, { total: number; count: number }>();
    examResults.forEach((result) => {
      const existing = subjectMap.get(result.subject) || { total: 0, count: 0 };
      subjectMap.set(result.subject, {
        total: existing.total + result.percentage,
        count: existing.count + 1,
      });
    });

    const subjectWisePerformance = Array.from(subjectMap.entries()).map(
      ([subject, data]) => ({
        subject,
        averageScore: data.total / data.count,
      })
    );

    // Calculate grade distribution
    const gradeMap = new Map<string, number>();
    examResults.forEach((result) => {
      gradeMap.set(result.grade, (gradeMap.get(result.grade) || 0) + 1);
    });

    const gradeDistribution = Array.from(gradeMap.entries()).map(
      ([grade, count]) => ({
        grade,
        count,
      })
    );

    setMetrics({
      averageScore,
      highestScore,
      lowestScore,
      passRate,
      totalExams,
      subjectWisePerformance,
      gradeDistribution,
    });
  };

  const handleStartExam = (examId: string) => {
    navigate(`/student/exam/${examId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="btn text-white font-semibold py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Analytics Section */}
          {metrics && (
            <div className="mb-12 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Performance
              </h2>

              {/* Performance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Average Score
                    </Typography>
                    <Typography variant="h4" className="text-blue-600">
                      {metrics.averageScore.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Highest Score
                    </Typography>
                    <Typography variant="h4" className="text-green-600">
                      {metrics.highestScore.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Pass Rate
                    </Typography>
                    <Typography variant="h4" className="text-purple-600">
                      {metrics.passRate.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Exams
                    </Typography>
                    <Typography variant="h4" className="text-indigo-600">
                      {metrics.totalExams}
                    </Typography>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject-wise Performance Chart */}
                <Paper sx={{ p: 2 }} className="bg-white rounded-lg shadow-sm">
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="text-gray-700"
                  >
                    Subject-wise Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.subjectWisePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="averageScore"
                        fill="#8884d8"
                        name="Average Score"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>

                {/* Grade Distribution Chart */}
                <Paper sx={{ p: 2 }} className="bg-white rounded-lg shadow-sm">
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="text-gray-700"
                  >
                    Grade Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={metrics.gradeDistribution}
                        dataKey="count"
                        nameKey="grade"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {metrics.gradeDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </div>
            </div>
          )}

          {/* Available Exams Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Exams
            </h2>
            {exams.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-600">
                  No exams available at the moment
                </h2>
                <p className="mt-2 text-gray-500">
                  Check back later for new exams
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onStartExam={() => handleStartExam(exam.id.toString())}
                    isTeacher={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
