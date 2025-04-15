import { ReactNode } from "react";
import Header from "../components/Header";

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="p-4 pt-16 flex flex-col gap-4">{children}</div>
    </>
  );
};

export default DashboardLayout;
