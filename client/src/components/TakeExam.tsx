import Webcam from "react-webcam";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Exam } from "../types";
import api_client from "../api_client";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface Question {
  id: number;
  text: string;
  options: string[];
  marks: number;
}

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await api_client.get<Exam>(`/exams/${examId}`);
        setExam(response.data);
        setTimeLeft(response.data.duration_minutes * 60); // Convert to seconds
      } catch (error) {
        console.error("Error fetching exam:", error);
        toast.error("Failed to load exam");
        navigate("/student/dashboard");
      }
    };

    fetchExam();
  }, [examId, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && exam) {
      handleSubmit();
    }
  }, [timeLeft, exam]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Convert examId to number since the API expects an integer
      const examIdNum = parseInt(examId || "", 10);
      if (isNaN(examIdNum)) {
        throw new Error("Invalid exam ID");
      }

      // Check if exam is still active
      if (!exam) {
        throw new Error("Exam not loaded");
      }

      const now = new Date();
      const startTime = new Date(exam.start_time);
      const endTime = new Date(exam.end_time);

      if (now < startTime) {
        toast.error("Exam has not started yet");
        return;
      }

      if (now > endTime) {
        toast.error("Exam has ended");
        return;
      }

      // Prepare the submission data
      const submissionData = {
        exam_id: examIdNum,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId, 10), // Convert question_id to number
          answer: answer,
        })),
      };

      // Submit the exam
      const { data } = await api_client.post(
        `/exams/${examId}/submit`,
        submissionData
      );

      // Show success message with marks obtained
      toast.success(
        `Exam submitted successfully! Total marks: ${data.total_marks}`
      );
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Error submitting exam:", error);
      if (error instanceof AxiosError) {
        // Show specific error message from the API if available
        const errorMessage =
          error.response?.data?.detail || "Failed to submit exam";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to submit exam");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const WebcamComponent = () => <Webcam />;

  return (
    <div className="relative max-h-screen">
      <div className="flex  justify-center absolute right-4 z-10 w-[400px] mt-8 mr-8 border-2 border-gray-300 rounded-lg items-center flex-col gap-2">
        <WebcamComponent />
        <span className="text-red-400 font-bold">You are being monitored</span>
      </div>
      <div className="min-h-screen relative overflow-scroll max-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
              <div className="text-lg font-semibold text-red-600">
                Time Left: {formatTime(timeLeft)}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{exam.description}</p>
          </div>

          <div className="space-y-6">
            {exam.questions.map((question: Question, index: number) => (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-md p-6 border-1 border-slate-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Question {index + 1}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {question.marks} marks
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{question.text}</p>
                <div className="space-y-2">
                  {question.options.map(
                    (option: string, optionIndex: number) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-3 p-3 rounded-lg border-1 border-slate-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) =>
                            handleAnswerChange(
                              question.id.toString(),
                              e.target.value
                            )
                          }
                          className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn text-white font-semibold py-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
