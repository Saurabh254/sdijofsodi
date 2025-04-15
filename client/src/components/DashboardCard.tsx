import React from 'react';

interface DashboardCardProps {
  icon: string;
  title: string;
  value: string | number;
  color: string;
}

const DashboardCard = ({ icon, title, value, color }: DashboardCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <i className={`${icon} text-2xl text-${color}-500`}></i>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;