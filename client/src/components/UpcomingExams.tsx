import { useEffect, useState } from "react";
import api_client from "../api_client";
import { Exam } from "../types";
import { useNavigate } from "react-router-dom";

const Card = ({ exam, state }: { exam: Exam; state: string }) => {
  const navigate = useNavigate();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateTotalMarks = (questions: Exam["questions"]) => {
    return questions.reduce(
      (total: number, question: Exam["questions"][0]) => total + question.marks,
      0
    );
  };

  return (
    <div className="min-w-64 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="bg-gray-800 text-white text-center py-3 px-4 font-semibold text-md tracking-wide">
        {exam.title}
      </div>
      <div className="flex flex-col gap-3 p-4 text-gray-700">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Duration:</span>
          <span>{exam.duration_minutes} Minutes</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Marks:</span>
          <span>{calculateTotalMarks(exam.questions)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Date:</span>
          <span>{formatDate(exam.start_time)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Time:</span>
          <span>{formatTime(exam.start_time)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Status:</span>
          <span
            className={`${
              state == "upcoming" ? "text-red-600" : "text-green-600"
            } font-semibold`}
          >
            {state}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Questions:</span>
          <span>{exam.questions.length}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium">View Exam:</span>
          <span
            className="btn text-white font-semibold py-1 px-3 rounded-xl bg-gray-700 cursor-pointer hover:bg-gray-800 transition duration-200"
            onClick={() => navigate(`/teacher/exam/${exam.id}`)}
          >
            View
          </span>
        </div>
      </div>
    </div>
  );
};

export default function UpcomingExams() {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api_client.get<Exam[]>("/exams?upcoming=true");
        setExams(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upcoming Exams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} exam={exam} state="upcoming" />
        ))}
      </div>
    </div>
  );
}
