import { RiAB, RiMenuSearchLine, RiPieChart2Line } from "@remixicon/react";
import { Link } from "react-router-dom";

export default function TeacherMainMenu() {
  return (
    <>
      <div className=" bg-[#e9ecf6] text-black tex p-8 rounded-lg w-full">
        <span className="menu-title text-black text-xl font-semibold mb-6 block">
          Main Menu
        </span>

        <div className="border-1 border-gray-300 mb-6"></div>
        <ul className="menu rounded-box items-center justify-evenly w-full [&>*]:px-8 flex flex-row gap-2 ">
          <li>
            <Link
              to="/teacher/create-exam"
              className="hover:bg-[#01013a] px-4 py-2 rounded-lg hover:text-white flex items-center bg-white gap-2 duration-200"
            >
              <RiAB /> Create new exam
            </Link>
          </li>
          <li>
            <Link
              to="/teacher/previous-exams"
              className="hover:bg-[#01013a] px-4 py-2 rounded-lg hover:text-white  flex items-center gap-2 bg-white duration-200"
            >
              <RiMenuSearchLine /> View Previous Exams
            </Link>
          </li>
          <li>
            <Link
              to="/teacher/students/list"
              className="hover:bg-[#01013a] px-4 py-2 rounded-lg hover:text-white  flex items-center gap-2 bg-white duration-200"
            >
              <RiMenuSearchLine /> View Students
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
