// src/App.tsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Analytics from "./components/Analytics";
import ExamResults from "./components/ExamResults";
import SubmissionDetails from "./components/SubmissionDetails";
import { Toaster } from "react-hot-toast";

// Lazy load components
const Login = lazy(() => import("./pages/Login"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const CreateExam = lazy(() => import("./components/CreateExam"));
const ViewExam = lazy(() => import("./components/ViewExam"));
const PreviousExams = lazy(() => import("./components/PreviousExams"));
const UserDashboard = lazy(() => import("./components/UserDashboard"));
const TakeExam = lazy(() => import("./components/TakeExam"));
const StudentsPage = lazy(() => import("./pages/StudentsPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const MyExams = lazy(() => import("./components/MyExams"));
const Results = lazy(() => import("./components/Results"));
const UpcomingExams = lazy(() => import("./components/UpcomingExams"));
const AddStudentForm = lazy(() => import("./components/AddStudentForm"));
const UserDashboardLayout = lazy(() => import("./layout/UserDashboardLayout"));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <div data-theme="light" className="h-full w-full">
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Teacher routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/create-exam" element={<CreateExam />} />
            <Route path="/teacher/view-exam/:id" element={<ViewExam />} />
            <Route path="/teacher/upcoming-exams" element={<UpcomingExams />} />
            <Route path="/teacher/previous-exams" element={<PreviousExams />} />
            <Route path="/teacher/results" element={<ExamResults />} />
            <Route path="/teacher/students/list" element={<StudentsPage />} />
            <Route path="/teacher/students/add" element={<AddStudentForm />} />
            <Route
              path="/teacher/exam/:examId/submission/:submissionId"
              element={<SubmissionDetails />}
            />

            {/* User/Student routes */}
            <Route path="/dashboard" element={<UserDashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="exams" element={<MyExams />} />
              <Route path="results" element={<Results />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>

            {/* Standalone routes */}
            <Route path="/exam/:examId" element={<TakeExam />} />
            <Route path="/exam/thank-you" element={<ThankYouPage />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
