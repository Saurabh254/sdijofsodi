import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const UserDashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
