import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

// components
import CustomInput from "../../../components/customInput";
import CustomDropdown from "../../../components/customDropdown";
import CustomButton from "../../../components/customButton";

// icons
import { ReactComponent as CancelIcon } from "../../../assets/icons/cancel.svg";
import { ReactComponent as ExternalLink } from "../../../assets/icons/external_link.svg";

// utils
import { levelOptions, departmentOptions } from "../../../utils/constants";
import { inputRuleNoPattern } from "../../../utils/validation";

function CreateLectureModal({ toggleIsOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lectureRoomId, setLectureRoomId] = useState("");

  const onCreate = (data) => {
    // generate room link
    setLectureRoomId("slkslkdjfsl");
  };

  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      title: "",
      department: "",
      level: "",
    },
  });

  return (
    <div className="overlay">
      <div className="flex flex-col bg-white w-[80%] lg:w-[60%] p-10 rounded-lg">
        <button
          onClick={() => toggleIsOpen()}
          className="pl-5 pb-5 mb-3 self-end"
        >
          <CancelIcon />
        </button>
        <CustomInput
          name="title"
          placeholder="Enter Lecture title"
          type="text"
          rules={inputRuleNoPattern("title")}
          control={control}
          errors={errors}
        />
        <CustomDropdown
          name="department"
          options={departmentOptions}
          rules={inputRuleNoPattern("department")}
          control={control}
          errors={errors}
        />
        <CustomDropdown
          name="level"
          options={levelOptions}
          rules={inputRuleNoPattern("level")}
          control={control}
          errors={errors}
        />
        <CustomButton
          text="Create Lecture Room"
          onClick={handleSubmit(onCreate)}
          isLoading={isLoading}
        />
        {lectureRoomId && (
          <div className="flex items-center justify-center">
            <Link
              target="_blank"
              to={`/app/classroom/${lectureRoomId}`}
              className="flex my-5"
            >
              <p className="font-semibold text-sm text-[#2F80ED]">
                {`https://localhost:3000/app/classroom/${lectureRoomId}`}
              </p>
              <ExternalLink />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateLectureModal;
