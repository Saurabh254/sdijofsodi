import { useState, useEffect } from "react";
import api_client from "../api_client";
import toast from "react-hot-toast";
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
  exam_id: number;
  student_id: number;
  student_name: string;
  submission_time: string;
  total_marks: number;
  is_submitted: boolean;
  exam: {
    title: string;
    description: string;
    total_marks: number;
  };
}

interface PerformanceMetrics {
  totalExams: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  subjectWisePerformance: { subject: string; averageScore: number }[];
  gradeDistribution: { grade: string; count: number }[];
}

const COLORS = ["#E5E7EB", "#D1D5DB", "#9CA3AF", "#6B7280", "#4B5563"];

const Results: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api_client.get<ExamResult[]>("/exams/results");
        setResults(response.data);
        calculateMetrics(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to load results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const calculateMetrics = (examResults: ExamResult[]) => {
    if (examResults.length === 0) return;

    const totalExams = examResults.length;
    const totalScore = examResults.reduce(
      (sum, result) => sum + result.total_marks,
      0
    );
    const averageScore = (totalScore / totalExams) * 100;
    const highestScore =
      Math.max(...examResults.map((result) => result.total_marks)) * 100;
    const lowestScore =
      Math.min(...examResults.map((result) => result.total_marks)) * 100;
    const passRate =
      (examResults.filter((result) => result.total_marks >= 40).length /
        totalExams) *
      100;

    const subjectMap = new Map<string, { total: number; count: number }>();
    examResults.forEach((result) => {
      const subject = result.exam.title.split(" ")[0]; // Assuming first word is subject
      const existing = subjectMap.get(subject) || { total: 0, count: 0 };
      subjectMap.set(subject, {
        total: existing.total + result.total_marks,
        count: existing.count + 1,
      });
    });

    const subjectWisePerformance = Array.from(subjectMap.entries()).map(
      ([subject, data]) => ({
        subject,
        averageScore: (data.total / data.count) * 100,
      })
    );

    const gradeMap = new Map<string, number>();
    examResults.forEach((result) => {
      const percentage = (result.total_marks / result.exam.total_marks) * 100;
      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B+";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C";
      else if (percentage >= 40) grade = "D";
      gradeMap.set(grade, (gradeMap.get(grade) || 0) + 1);
    });

    const gradeDistribution = Array.from(gradeMap.entries()).map(
      ([grade, count]) => ({
        grade,
        count,
      })
    );

    setMetrics({
      totalExams,
      averageScore,
      highestScore,
      lowestScore,
      passRate,
      subjectWisePerformance,
      gradeDistribution,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
          <div className="ml-64">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-medium text-gray-900">
                Exam Results
              </h1>
            </div>

            {!metrics ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-600">
                  No results available
                </h2>
                <p className="mt-2 text-gray-500">
                  You haven't taken any exams yet
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Subject-wise Performance Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Typography variant="h6" className="mb-4">
                    Subject-wise Performance
                  </Typography>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.subjectWisePerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="averageScore" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Grade Distribution Chart */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Typography variant="h6" className="mb-4">
                    Grade Distribution
                  </Typography>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
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
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  {results.map((result) => (
                    <Paper
                      key={result.id}
                      className="bg-white border border-gray-200 p-6 hover:border-gray-300 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Typography variant="h6" className="text-gray-900">
                            {result.exam.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-gray-500 mt-1"
                          >
                            {result.exam.description}
                          </Typography>
                        </div>
                        <div className="text-right">
                          <Typography
                            variant="h6"
                            className={`${
                              result.total_marks >= 40
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {(
                              (result.total_marks / result.exam.total_marks) *
                              100
                            ).toFixed(1)}
                            %
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-gray-500 mt-1"
                          >
                            Score: {result.total_marks} /{" "}
                            {result.exam.total_marks}
                          </Typography>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                        <div>Submitted by: {result.student_name}</div>
                        <div>Date: {formatDate(result.submission_time)}</div>
                      </div>
                    </Paper>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
