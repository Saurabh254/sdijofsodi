import React from "react";
import { Link, useLocation } from "react-router-dom";

const UserSidebarNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="space-y-2">
      <Link
        to="/dashboard"
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          isActive("/dashboard") ? "bg-gray-700" : "hover:bg-gray-700"
        }`}
      >
        <i className="ri-dashboard-line"></i>
        <span>Homepage</span>
      </Link>
      <Link
        to="/dashboard/exams"
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          isActive("/dashboard/exams") ? "bg-gray-700" : "hover:bg-gray-700"
        }`}
      >
        <i className="ri-file-list-line"></i>
        <span>My Exams</span>
      </Link>
      <Link
        to="/dashboard/results"
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          isActive("/dashboard/results") ? "bg-gray-700" : "hover:bg-gray-700"
        }`}
      >
        <i className="ri-bar-chart-line"></i>
        <span>Results</span>
      </Link>
    </nav>
  );
};

export default UserSidebarNavigation;
