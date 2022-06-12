import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

// firebase
import { getLectures, getOngoingLectures } from "../../service/firebase";

// components
import Filter from "./components/filter";
import { ReactComponent as EmptyState } from "../../assets/icons/empty_state.svg";

// context
import AppContext from "../../contexts/AppContext";

// utils
import { levelOptions, departmentOptions } from "../../utils/constants";

//styles
import "./index.css";

function StudentPortal(props) {
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const {
    user: { fullname, email, department: dept, level: lvl },
  } = useContext(AppContext);
  const [lectures, setLectures] = useState([]);
  const [onGoingLectures, setOngoingLectures] = useState([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      await getLectures(
        {},
        (lcts) => {
          setLectures(lcts);
        },
        (error) => {
          alert(error);
        }
      );
      await getOngoingLectures(
        {},
        (lcts) => {
          console.log({ lcts });
          setOngoingLectures(lcts);
          setIsLoading(false);
        },
        (error) => {
          alert(error);
        }
      );
    };

    makeRequest();
  }, []);

  const departmentFull = {
    ECE: "Electronic and Computer Engineering",
    CPE: "Chemical and Polymer Engineering",
    MECH: "Mechanical Engineering",
  };

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
          Personal Information
        </h3>
        <div className="flex flex-col w-full">
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Full Name:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left capitalize">
              {fullname}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Email:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {email}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Department:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {departmentFull[dept]}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Level:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">{lvl}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-12">
        <h3 className="font-bold text-[#282828] text-lg lg:text-3xl my-4">
          Ongoing Lectures
        </h3>
      </div>
      <ul className="flex flex-col mt-5 bg-[#FAFAFA]">
        {!loading && onGoingLectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4">
            <EmptyState />
            <p className="mt-3 text-sm">No Ongoing lectures</p>
          </div>
        ) : (
          onGoingLectures.map((lecture) => (
            <li
              key={lecture.classroomId}
              className="flex justify-between items-center border-b border-[#c9c9c9ce] py-3"
            >
              <div className="flex flex-col">
                <p className="text-lg font-bold text-[#2F80ED]">
                  {lecture.metadata?.title}
                </p>
                <p className="flex items-center font-bold text-sm lg:text-lg text-[#ADADAD]">
                  <span>{lecture.metadata?.department}</span>
                  <span className="mx-3">•</span>
                  <span>{lecture.metadata?.level}</span>
                  <span className="mx-3">•</span>
                  <span>{lecture.metadata?.date}</span>
                  <span className="mx-3">•</span>
                  <span>{lecture.metadata?.time}</span>
                </p>
              </div>
              <Link
                to={`/app/classroom/${lecture.classroomId}`}
                className="px-8 py-1 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
              >
                Join
              </Link>
            </li>
          ))
        )}
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
      {!loading && lectures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4">
          <EmptyState />
          <p className="mt-3 text-sm">No Uploaded lectures</p>
        </div>
      ) : (
        <ul className="flex flex-col mt-5 bg-[#FAFAFA]">
          {!loading && lectures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4">
              <EmptyState />
              <p className="mt-3 text-sm">No Uploaded lectures</p>
            </div>
          ) : (
            lectures.map((lecture) => (
              <li
                key={lecture.lectureId}
                className="flex justify-between items-center border-b border-[#c9c9c9ce] py-3"
              >
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-[#2F80ED]">
                    {lecture.title}
                  </p>
                  <p className="flex items-center font-bold text-sm lg:text-lg text-[#ADADAD]">
                    <span>{lecture.department}</span>
                    <span className="mx-3">•</span>
                    <span>{lecture.level}</span>
                    <span className="mx-3">•</span>
                    <span>{lecture.createdAt}</span>
                  </p>
                </div>
                <a
                  className="px-8 py-1 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
                  href={lecture.downloadUrl}
                >
                  Watch
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default StudentPortal;
