import React from "react";
import { Question } from "../types";
import { RiArrowLeftLine } from "@remixicon/react";

interface ListItemProps {
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  index,
  isSelected,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className={`relative flex flex-col rounded-lg bg-white cursor-pointer border-b-1 border-slate-200 ${
        isSelected ? "bg-slate-100" : ""
      }`}
    >
      <nav className="flex min-w-[240px] flex-col gap-1 p-1.5 py-0">
        <div
          role="button"
          onClick={onSelect}
          className="text-slate-800 flex w-full items-center rounded-md px-2 py-1 pl-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
        >
          Question {index + 1}
          <div className="ml-auto grid place-items-center justify-self-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-md border border-transparent p-2.5 text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none cursor-pointer"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

interface CreateExamSidebarProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  examTitle: string;
  setExamTitle: (title: string) => void;
  examDescription: string;
  setExamDescription: (description: string) => void;
  examDuration: number;
  setExamDuration: (duration: number) => void;
  totalMarks: number;
  setTotalMarks: (marks: number) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  onSubmit: () => void;
}

const CreateExamSidebar: React.FC<CreateExamSidebarProps> = ({
  questions,
  setQuestions,
  currentQuestionIndex,
  onQuestionSelect,
  examTitle,
  setExamTitle,
  examDescription,
  setExamDescription,
  examDuration,
  setExamDuration,
  totalMarks,
  setTotalMarks,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onSubmit,
}) => {
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    if (currentQuestionIndex === index) {
      onQuestionSelect(-1);
    } else if (currentQuestionIndex > index) {
      onQuestionSelect(currentQuestionIndex - 1);
    }
  };

  const handleQuestionAdd = () => {
    // Logic to add a new question
    onQuestionSelect(-1); // Reset selection to allow for new question entry
  };

  const handleClear = () => {
    // Logic to clear the current question form
    setExamTitle("");
    setExamDescription("");
    setExamDuration(60);
    setTotalMarks(100);
    setStartTime("");
    setEndTime("");
    setQuestions([]); // Clear all questions if needed
  };

  return (
    <div className="text-black w-78">
      <span className="flex items-center gap-8 p-4 pt-8">
        <RiArrowLeftLine /> Create Exam
      </span>
      <div className="divider border-t-2 border-gray-300"></div>
      <span className="p-4 block">Questions</span>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <ListItem
            key={question.id}
            index={index}
            isSelected={currentQuestionIndex === index}
            onSelect={() => onQuestionSelect(index)}
            onDelete={() => handleDeleteQuestion(index)}
          />
        ))}
      </div>
      <div className="p-4">
        <button onClick={handleQuestionAdd} className="btn btn-primary w-full">
          Add Question
        </button>
        <button onClick={handleClear} className="btn btn-error w-full mt-2">
          Clear
        </button>
      </div>
    </div>
  );
};

export default CreateExamSidebar;
