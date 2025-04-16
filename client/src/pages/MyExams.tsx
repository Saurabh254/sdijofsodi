import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api_client from "../api_client";
import { Exam } from "../types";
import toast from "react-hot-toast";

const MyExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api_client.get("/exams");
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  const completedExams = exams.filter((exam) => exam.status === "completed");

  return (
    <div className="flex">
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Completed Exams
          </h1>

          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-200">
              {completedExams.map((exam) => (
                <div key={exam.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {exam.description}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                      Completed
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-sm font-medium">
                        {formatDate(exam.start_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Marks</p>
                      <p className="text-sm font-medium">
                        {exam.questions.reduce((sum, q) => sum + q.marks, 0)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="btn btn-ghost text-primary">
                      View Result
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {completedExams.length === 0 && (
              <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-lg text-gray-500">
                  No completed exams found
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyExams;
