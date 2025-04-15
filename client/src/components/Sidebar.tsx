import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 text-black bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Student Portal</h2>
      </div>
      <nav className="p-4 flex flex-col h-full">
        <ul className="space-y-2 h-[90%] flex flex-col ">
          <li>
            <Link
              to="/user"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/user")
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <i className="ri-dashboard-line"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/user/exams"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/user/exams")
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <i className="ri-file-list-line"></i>
              <span>My Exams</span>
            </Link>
          </li>
          <li>
            <Link
              to="/user/results"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/user/results")
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <i className="ri-bar-chart-line"></i>
              <span>Results</span>
            </Link>
          </li>
          <li>
            <Link
              to="/user/profile"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/user/profile")
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <i className="ri-user-settings-line"></i>
              <span>Profile</span>
            </Link>
          </li>
          <li className="mt-auto">
            <Link to="/login" className="btn btn-error text-white w-full">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
