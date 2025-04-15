import { useState } from "react";
import api_client from "../api_client";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

interface Question {
  question_text: string;
  marks: number;
  options: string[];
  correct_answer: string;
}

interface ExamFormData {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  questions: Question[];
}

const initialQuestion: Question = {
  question_text: "",
  marks: 1,
  options: ["", "", "", ""],
  correct_answer: "",
};

const CreateExam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    duration_minutes: 60,
    questions: [initialQuestion],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string | number | string[]
  ) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = value;
      newQuestions[questionIndex].options = newOptions;
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...initialQuestion }],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format dates to ISO string
      const formattedData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };

      await api_client.post("/exams", formattedData);
      toast.success("Exam created successfully!");
      navigate("/teacher/dashboard");
    } catch (error) {
      toast.error("Failed to create exam. Please try again.");
      console.error("Error creating exam:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6 mt-20">
            <h1 className="text-2xl font-bold">Create New Exam</h1>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white cursor-pointer rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Exam Info */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4 border-1 border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Exam Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-1 border-slate-100 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    required
                  />
                </div>
                <div className="border-1 border-slate-100 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    required
                  />
                </div>
                <div className="border-1 border-slate-100 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    required
                  />
                </div>
                <div className="border-1 border-slate-100 p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    required
                  />
                </div>
              </div>
              <div className="border-1 border-slate-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  required
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Question
                </button>
              </div>

              {formData.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="bg-white p-6 rounded-lg shadow-md space-y-4 border-1 border-slate-100"
                >
                  <div className="flex justify-between items-center border-1 border-slate-100 p-4 rounded-md">
                    <h3 className="text-md font-medium">
                      Question {questionIndex + 1}
                    </h3>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="border-1 border-slate-100 p-4 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={question.question_text}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "question_text",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                      required
                    />
                  </div>

                  <div className="border-1 border-slate-100 p-4 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={question.marks}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "marks",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                      required
                    />
                  </div>

                  <div className="border-1 border-slate-100 p-4 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    <div className="mt-1 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <input
                          key={optionIndex}
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-1 border-slate-100 p-4 rounded-md">
                    <label className="block text-sm font-medium text-gray-700">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={question.correct_answer}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "correct_answer",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-1 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create Exam
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateExam;
