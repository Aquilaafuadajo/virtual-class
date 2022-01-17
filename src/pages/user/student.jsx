import React, { useState } from "react";
import { Link } from "react-router-dom";

// components
import Filter from "./components/filter";

// utils
import { levelOptions, departmentOptions } from "../../utils/constants";

//styles
import "./index.css";

function StudentPortal() {
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");

  const onChangeLevel = (e) => {
    console.log(e.target.value);
    setLevel(e.target.value);
  };
  const onChangeDepartment = (e) => {
    setDepartment(e.target.value);
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
              Afuadajo Emmanuel
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Email:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              aquilaafuadajo@gmail.com
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Department:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              Electronic and Computer Engineering
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Level:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              500(Level)
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-12">
        <h3 className="font-bold text-[#282828] text-lg lg:text-3xl my-4">
          Ongoing Lectures
        </h3>
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
          <Link
            to="/app/classroom/slkddk"
            className="px-8 py-1 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
          >
            Join
          </Link>
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
          <Link
            to="/app/classroom/slkddk"
            className="px-8 py-1 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
          >
            Join
          </Link>
        </li>
      </ul>
      <div className="flex justify-between items-center mt-12">
        <h3 className="font-bold text-[#282828] text-lg lg:text-3xl my-4">
          Uploaded Lectures
        </h3>
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
          <Link
            to="/app/classroom/slkddk"
            className="px-8 py-1 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
          >
            Join
          </Link>
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
          <Link
            to="/app/classroom/slkddk"
            className="px-8 py-1 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
          >
            Join
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default StudentPortal;
