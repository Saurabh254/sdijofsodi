import React from "react";
import TeacherDashboardLayout from "../layout/TeacherDashboardLayout";
import Graph from "../components/AverageExamMarksGraph";
import TeacherMainMenu from "../components/TeacherMainMenu";
import UpcomingExams from "../components/UpcomingExams";

const TeacherDashboard: React.FC = () => {
  return (
    <>
      <TeacherDashboardLayout>
        <div className="w-full text-[#01013a] flex flex-col gap-8 p-8">
          <TeacherMainMenu />
          <Graph />
          <UpcomingExams />
        </div>
      </TeacherDashboardLayout>
    </>
  );
};

export default TeacherDashboard;
