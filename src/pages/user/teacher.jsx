import React, { useState, useContext } from "react";

// components
import Filter from "./components/filter";
import CreateLectureModal from "./components/createLectureModal";

// contexts
import AppContext from "../../contexts/AppContext";

// icons
import { ReactComponent as AddIcon } from "../../assets/icons/plus.svg";
import { ReactComponent as MoreVertIcon } from "../../assets/icons/more_vertical.svg";

// utils
import { levelOptions, departmentOptions } from "../../utils/constants";

//styles
import "./index.css";

function TeacherPortal() {
  const { user } = useContext(AppContext);
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChangeLevel = (e) => {
    console.log(e.target.value);
    setLevel(e.target.value);
  };
  const onChangeDepartment = (e) => {
    setDepartment(e.target.value);
  };

  const departmentFull = {
    ECE: "Electronic and Computer Engineering",
    CPE: "Chemical and Polymer Engineering",
    MECH: "Mechanical Engineering",
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col">
        <h3 className="font-bold text-[#282828] text-xl lg:text-3xl my-4">
          Bio Data
        </h3>
        <div className="flex flex-col w-full">
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Full Name:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {user?.fullname}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Email:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {user?.email}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Department:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {departmentFull[user?.department]}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-12">
        <h3 className="font-bold text-[#282828] text-lg lg:text-3xl my-4">
          Uploaded Lectures
        </h3>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="flex items-center bg-[#2F80ED] font-bold text-white h-max text-xs lg:text-lg p-3 lg:p-4 rounded-lg"
        >
          <p className="flex items-center">
            <span>Create Lecture Room</span>{" "}
            <span>
              <AddIcon className="ml-3" />
            </span>
          </p>
        </button>
      </div>
      <div className="flex justify-between mt-3">
        <div className="flex items-center">
          <p className="mr-2">Filter:</p>
          <Filter
            options={[
              { label: "Department", value: "" },
              ...departmentOptions.slice(1),
            ]}
            value={department}
            onChange={onChangeDepartment}
            name="department"
          />
          <Filter
            options={[{ label: "Level", value: "" }, ...levelOptions.slice(1)]}
            value={level}
            onChange={onChangeLevel}
            name="level"
          />
        </div>
      </div>
      <ul className="flex flex-col mt-5 bg-[#FAFAFA]">
        <li className="flex justify-between items-center border-b border-[#c9c9c9ce] py-3">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-[#2F80ED]">
              Operating Systems Research
            </p>
            <p className="flex items-center font-bold text-sm lg:text-lg text-[#ADADAD]">
              <span>ECE</span>
              <span className="mx-3">•</span>
              <span>300L</span>
              <span className="mx-3">•</span>
              <span>11-01-2022</span>
            </p>
          </div>
          <button className="p-4">
            <MoreVertIcon />
          </button>
        </li>
        <li className="flex justify-between items-center border-b border-[#c9c9c9ce] py-3">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-[#2F80ED]">
              Operating Systems Research
            </p>
            <p className="flex items-center font-bold text-sm lg:text-lg text-[#ADADAD]">
              <span>ECE</span>
              <span className="mx-3">•</span>
              <span>300L</span>
              <span className="mx-3">•</span>
              <span>11-01-2022</span>
            </p>
          </div>
          <button className="p-4">
            <MoreVertIcon />
          </button>
        </li>
      </ul>
      {isModalOpen && (
        <CreateLectureModal toggleIsOpen={() => setIsModalOpen(!isModalOpen)} />
      )}
    </div>
  );
}

export default TeacherPortal;
