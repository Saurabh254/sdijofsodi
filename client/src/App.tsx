// src/App.tsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Analytics from "./components/Analytics";

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

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <div data-theme="light" className="h-full w-full">
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/teacher/exam/:examId" element={<ViewExam />} />
            <Route path="/teacher/previous-exams" element={<PreviousExams />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/student/dashboard" element={<UserDashboard />} />
            <Route path="/student/exam/:examId" element={<TakeExam />} />
            <Route path="/teacher/students/list" element={<StudentsPage />} />
            <Route path="/exam/thank-you" element={<ThankYouPage />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* <Route path="/dashboard" element={<StudentDashboard />} /> */}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
