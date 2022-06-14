import React, { useState, useContext, useEffect } from "react";
import { Popover } from "react-tiny-popover";
import { Link } from "react-router-dom";

// firebase
import {
  getLectures,
  deleteLecture,
  getOngoingLectures,
} from "../../service/firebase";

// components
import Filter from "./components/filter";
import CreateLectureModal from "./components/createLectureModal";

// contexts
import AppContext from "../../contexts/AppContext";

// icons
import { ReactComponent as AddIcon } from "../../assets/icons/plus.svg";
import { ReactComponent as MoreVertIcon } from "../../assets/icons/more_vertical.svg";
import { ReactComponent as EmptyState } from "../../assets/icons/empty_state.svg";

// utils
import { levelOptions, departmentOptions } from "../../utils/constants";

//styles
import "./index.css";

function TeacherPortal() {
  const { user } = useContext(AppContext);
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [onGoingLectures, setOngoingLectures] = useState([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      console.log(user.userId);
      await getLectures(
        { userId: user.userId },
        (lcts) => {
          setLectures(lcts);
          setIsLoading(false);
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

  const PopoverButton = ({ options }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
      <Popover
        isOpen={isPopoverOpen}
        // positions={["top", "bottom", "left", "right"]}
        position="left"
        onClickOutside={() => setIsPopoverOpen(false)}
        content={
          <div className="bg-[#EDF2F7] rounded-lg ">
            {options.map(({ label, action, textColor, borderB, linkTo }) =>
              linkTo ? (
                <a
                  key={label}
                  className={`p-3 border-[#BDBDBD] flex items-center justify-between cursor-pointer ${
                    borderB && "border-b"
                  } ${textColor || "text-[#2F80ED]"}`}
                  href={linkTo}
                >
                  {label}
                </a>
              ) : (
                <p
                  key={label}
                  className={`p-3 border-[#BDBDBD] flex items-center justify-between cursor-pointer ${
                    borderB && "border-b"
                  } ${textColor || "text-[#2F80ED]"}`}
                  onClick={() => {
                    action();
                    setIsPopoverOpen(!isPopoverOpen);
                  }}
                >
                  {label}
                </p>
              )
            )}
          </div>
        }
      >
        <button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className="p-4"
        >
          <MoreVertIcon />
        </button>
      </Popover>
    );
  };

  const onDelete = async (data) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      await deleteLecture(
        { ...data },
        () => {
          const lects = lectures.filter(
            (lect) => lect.lectureId !== data.lectureId
          );
          setLectures(lects);
          alert("lecture deleted successfully");
        },
        (error) => alert(error)
      );
    }
  };

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
          Personal Information
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
          Ongoing Lectures
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
      {/* <div className="flex justify-between mt-3">
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
      </div> */}
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
              <PopoverButton
                options={[
                  {
                    label: "Watch",
                    linkTo: lecture.downloadUrl,
                    borderB: true,
                  },
                  {
                    label: "Delete",
                    action: () =>
                      onDelete({
                        fileRef: lecture.fileRef,
                        lectureId: lecture.lectureId,
                      }),
                    textColor: "delete",
                  },
                ]}
              />
            </li>
          ))
        )}
      </ul>
      {isModalOpen && (
        <CreateLectureModal toggleIsOpen={() => setIsModalOpen(!isModalOpen)} />
      )}
    </div>
  );
}

export default TeacherPortal;
