import React from "react";
import UserSidebarNavigation from "./UserSidebarNavigation";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <UserSidebarNavigation />
      </div>
    </div>
  );
};

export default Sidebar;
