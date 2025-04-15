import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const MyExams = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingExams = [
    {
      id: 1,
      subject: "Mathematics",
      title: "Mid-Term Examination",
      date: "2024-03-15",
      time: "10:00 AM",
      duration: "2 hours",
      totalMarks: 100,
    },
    {
      id: 2,
      subject: "Physics",
      title: "Final Examination",
      date: "2024-03-20",
      time: "2:00 PM",
      duration: "3 hours",
      totalMarks: 150,
    },
  ];

  const completedExams = [
    {
      id: 1,
      subject: "Chemistry",
      title: "Quarterly Test",
      date: "2024-02-01",
      score: 85,
      totalMarks: 100,
      status: "Passed",
    },
    {
      id: 2,
      subject: "Biology",
      title: "Mid-Term Test",
      date: "2024-01-15",
      score: 92,
      totalMarks: 100,
      status: "Passed",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Exams</h1>

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

          {/* Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === "upcoming" ? (
              <div className="divide-y divide-gray-200">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {exam.title}
                        </h3>
                        <p className="text-sm text-gray-500">{exam.subject}</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-semibold text-yellow-600 bg-yellow-100 rounded-full">
                        Upcoming
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-sm font-medium">{exam.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="text-sm font-medium">{exam.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="text-sm font-medium">{exam.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Marks</p>
                        <p className="text-sm font-medium">{exam.totalMarks}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        Start Exam
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {completedExams.map((exam) => (
                  <div key={exam.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {exam.title}
                        </h3>
                        <p className="text-sm text-gray-500">{exam.subject}</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                        {exam.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-sm font-medium">{exam.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Score</p>
                        <p className="text-sm font-medium">
                          {exam.score}/{exam.totalMarks}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        View Result
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyExams;
