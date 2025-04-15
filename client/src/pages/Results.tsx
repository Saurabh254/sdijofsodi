import React from "react";
import Sidebar from "../components/Sidebar";
import Graph from "../components/AverageExamMarksGraph";

const Results = () => {
  const examResults = [
    {
      id: 1,
      subject: "Mathematics",
      examTitle: "Mid-Term Examination",
      date: "2024-02-01",
      score: 85,
      totalMarks: 100,
      percentage: 85,
      grade: "A",
      status: "Passed",
      feedback:
        "Good understanding of core concepts. Could improve in problem-solving speed.",
    },
    {
      id: 2,
      subject: "Physics",
      examTitle: "Final Examination",
      date: "2024-01-15",
      score: 92,
      totalMarks: 100,
      percentage: 92,
      grade: "A+",
      status: "Passed",
      feedback: "Excellent performance. Strong grasp of theoretical concepts.",
    },
    {
      id: 3,
      subject: "Chemistry",
      examTitle: "Quarterly Test",
      date: "2024-01-01",
      score: 78,
      totalMarks: 100,
      percentage: 78,
      grade: "B+",
      status: "Passed",
      feedback:
        "Good understanding of basic concepts. Needs improvement in organic chemistry.",
    },
  ];

  const performanceSummary = {
    totalExams: 12,
    averageScore: 85,
    highestScore: 92,
    lowestScore: 75,
    passRate: 100,
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Exam Results
          </h1>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Exams</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {performanceSummary.totalExams}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Average Score
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {performanceSummary.averageScore}%
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Highest Score
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {performanceSummary.highestScore}%
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pass Rate</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {performanceSummary.passRate}%
              </p>
            </div>
          </div>

          {/* Performance Graph */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold mb-4">Performance Trend</h2>
            <Graph />
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Detailed Results</h2>
              <div className="space-y-6">
                {examResults.map((result) => (
                  <div
                    key={result.id}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {result.examTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {result.subject}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                          {result.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-sm font-medium">{result.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Score</p>
                        <p className="text-sm font-medium">
                          {result.score}/{result.totalMarks}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Percentage</p>
                        <p className="text-sm font-medium">
                          {result.percentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Grade</p>
                        <p className="text-sm font-medium">{result.grade}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Feedback</p>
                      <p className="text-sm font-medium">{result.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
