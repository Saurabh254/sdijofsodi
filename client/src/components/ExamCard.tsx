import { useNavigate } from "react-router-dom";
import { Exam } from "../types";

interface ExamCardProps {
  exam: Exam;
  onStartExam: () => void;
  isTeacher: boolean;
}

const ExamCard = ({ exam, onStartExam, isTeacher }: ExamCardProps) => {
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
    return questions.reduce((total, question) => total + question.marks, 0);
  };

  const isExamEnded = () => {
    const now = new Date();
    const endTime = new Date(exam.end_time);
    return now > endTime;
  };

  return (
    <div className="min-w-64 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-1 border-slate-100">
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
          <span className="font-medium">Questions:</span>
          <span>{exam.questions.length}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium">Status:</span>
          {isExamEnded() ? (
            <span className="text-red-600 font-semibold">Exam Ended</span>
          ) : (
            <button
              onClick={() => {
                if (isTeacher) {
                  navigate(`/teacher/exam/${exam.id}`);
                } else {
                  onStartExam();
                }
              }}
              className="btn text-white font-semibold py-1 px-3 rounded-xl bg-indigo-600 cursor-pointer hover:bg-indigo-700 transition duration-200"
            >
              {isTeacher ? "View" : "Start"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
