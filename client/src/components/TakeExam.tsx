import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api_client from "../api_client";
import toast from "react-hot-toast";
import Header from "./Header";
import {
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  marks: number;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  questions: Question[];
}

interface Answer {
  question_id: number;
  answer: string;
}

const TakeExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await api_client.get<Exam>(`/exams/${examId}`);
        setExam(response.data);
        setTimeLeft(response.data.duration_minutes * 60);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching exam:", error);
        toast.error("Failed to load exam");
        navigate("/dashboard");
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

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (a) => a.question_id === questionId
      );
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { question_id: questionId, answer };
        return newAnswers;
      }
      return [...prev, { question_id: questionId, answer }];
    });
  };

  const handleSubmit = async () => {
    if (!examId) {
      toast.error("Invalid exam ID");
      return;
    }

    try {
      await api_client.post(`/exams/${examId}/submit`, {
        exam_id: parseInt(examId),
        answers: answers[0],
      });

      toast.success("Exam submitted successfully");
      navigate("/exam/thank-you");
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Failed to submit exam");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!exam) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-medium text-gray-900">
                  {exam.title}
                </h1>
                <p className="text-gray-500 mt-1">{exam.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium text-gray-900">
                  Time Remaining
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {exam.questions.map((question, index) => (
                <Paper key={question.id} className="p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <Typography variant="h6" className="text-gray-900">
                      Question {index + 1}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {question.marks} marks
                    </Typography>
                  </div>
                  <Typography className="mb-4 text-gray-700">
                    {question.question_text}
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={
                        answers.find((a) => a.question_id === question.id)
                          ?.answer || ""
                      }
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    >
                      {question.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={option}
                          control={<Radio />}
                          label={option}
                          className="mb-2"
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="bg-gray-800 hover:bg-gray-900"
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TakeExam;
