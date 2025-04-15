import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
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
import api_client from "../api_client";

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

const Analytics: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api_client.get("/exams/results");
        setResults(response.data);
        calculateMetrics(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Performance Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Performance Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h4">
                {metrics?.averageScore.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Highest Score
              </Typography>
              <Typography variant="h4">
                {metrics?.highestScore.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pass Rate
              </Typography>
              <Typography variant="h4">
                {metrics?.passRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Exams
              </Typography>
              <Typography variant="h4">{metrics?.totalExams}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject-wise Performance Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Subject-wise Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics?.subjectWisePerformance}>
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
        </Grid>

        {/* Grade Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Grade Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics?.gradeDistribution}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {metrics?.gradeDistribution.map((entry, index) => (
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
