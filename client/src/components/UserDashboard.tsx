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
import WebcamWarning from "./WebCamWarning";

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

const COLORS = ["#E5E7EB", "#D1D5DB", "#9CA3AF", "#6B7280", "#4B5563"];

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
    navigate(`/exam/${examId}`);
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
          {/* Main Content */}
          <div className="">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-medium text-gray-900">
                Student Dashboard
              </h1>
            </div>

            {/* Analytics Section */}
            {metrics && (
              <div className="mb-12 bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">
                  Your Performance
                </h2>

                {/* Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <CardContent>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        className="text-sm"
                      >
                        Average Score
                      </Typography>
                      <Typography variant="h4" className="text-gray-900">
                        {metrics.averageScore.toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <CardContent>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        className="text-sm"
                      >
                        Highest Score
                      </Typography>
                      <Typography variant="h4" className="text-gray-900">
                        {metrics.highestScore.toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <CardContent>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        className="text-sm"
                      >
                        Pass Rate
                      </Typography>
                      <Typography variant="h4" className="text-gray-900">
                        {metrics.passRate.toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <CardContent>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        className="text-sm"
                      >
                        Total Exams
                      </Typography>
                      <Typography variant="h4" className="text-gray-900">
                        {metrics.totalExams}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Paper
                    sx={{ p: 2 }}
                    className="bg-white border border-gray-200"
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="text-gray-700 text-sm font-medium"
                    >
                      Subject-wise Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metrics.subjectWisePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="subject" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="averageScore"
                          fill="#9CA3AF"
                          name="Average Score"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>

                  <Paper
                    sx={{ p: 2 }}
                    className="bg-white border border-gray-200"
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="text-gray-700 text-sm font-medium"
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
              <WebcamWarning />
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Available Exams
              </h2>
              {exams.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h2 className="text-lg font-medium text-gray-600">
                    No exams available at the moment
                  </h2>
                  <p className="mt-2 text-gray-500">
                    Check back later for new exams
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    </>
  );
};

export default UserDashboard;
