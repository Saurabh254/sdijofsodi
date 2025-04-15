import React, { useState, useEffect } from "react";
import { Question } from "../types";

interface CreateQuestionProps {
  question?: Question;
  onSubmit: (question: Question) => void;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({
  question,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Question>({
    id: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
        id: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      });
    }
  }, [question]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === "options" && index !== undefined) {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCorrectAnswerChange = (value: string) => {
    setFormData({ ...formData, correctAnswer: Number(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion = {
      ...formData,
      id: formData.id || Date.now().toString(),
    };
    onSubmit(newQuestion);
  };

  const handleClear = () => {
    setFormData({
      id: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
  };

  return (
    <div className="w-full mx-auto p-6">
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {question ? "Edit Question" : "Create a New Question"}
        </h2>

        {/* Question Text */}
        <div className="form-control mb-4 flex flex-col w-full">
          <label className="label">
            <span className="label-text font-semibold">Question</span>
          </label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            className="textarea textarea-bordered border-1 border-slate-400 bg-white mt-3 w-[98%]"
            placeholder="Enter your question"
            required
          />
        </div>

        <span className="flex font-semibold py-4">Options</span>
        {/* Options */}
        <div className="flex justify-evenly">
          {formData.options.map((option, index) => (
            <div key={index} className="form-control mb-4 flex gap-2">
              <label className="label">
                <span className="label-text">{index + 1}.</span>
              </label>
              <input
                type="text"
                name="options"
                value={option}
                onChange={(e) => handleInputChange(e, index)}
                className="input input-bordered bg-white border-1 border-slate-400"
                placeholder={`Option ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>

        {/* Correct Answer Selection */}
        <div className="form-control mb-6 mt-8">
          <label className="label">
            <span className="label-text font-semibold">Correct Answer</span>
          </label>
          <div className="flex flex-wrap gap-4 mt-4">
            {formData.options.map((_, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={index}
                  checked={formData.correctAnswer === index}
                  onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                  className="checkbox checked:text-black border-1 border-slate-300"
                  required
                />
                <span>Option {index + 1}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-error w-fit"
          >
            Clear
          </button>
          <button type="submit" className="btn btn-primary w-fit">
            {question ? "Update Question" : "Submit Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
