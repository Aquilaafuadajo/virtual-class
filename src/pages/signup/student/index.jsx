import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

// context
import AppContext from "../../../contexts/AppContext";

// components
import OnboardingLayout from "../../../containers/onboardingLayout";
import CustomButton from "../../../components/customButton";
import CustomInput from "../../../components/customInput";
import CustomDropdown from "../../../components/customDropdown";

// utils
import { emailRule, inputRuleNoPattern } from "../../../utils/validation";
// firebase
import { signup } from "../../../service/firebase";

function StudentSignUp() {
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      fullname: "",
      department: "",
      level: "",
      email: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(AppContext);
  const history = useHistory();
  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    await signup(
      { ...data, role: "student" },
      (userId) => {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data, userId, role: "student" })
        );
        setUser({ ...data, userId, role: "student" });
        setIsLoading(false);
        history.push(`/app/${userId}`);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );
  };

  const departmentOptions = [
    { value: "", label: "Select Department" },
    { value: "CHEMICAL ENGR", label: "CHEMICAL ENGR" },
    {
      value: "ELECTRONIC & COMPUTER ENGR",
      label: "ELECTRONIC & COMPUTER ENGR",
    },
    { value: "MECHANINCAL ENGR", label: "MECHANINCAL ENGR" },
    { value: "SYSTEMS & INDUSTRIAL ENGR", label: "SYSTEMS & INDUSTRIAL ENGR" },
    { value: "CIVIL ENGR", label: "CIVIL ENGR" },
    {
      value: "AERONAUTICS & ASTRONAUTICS ENGR",
      label: "AERONAUTICS & ASTRONAUTICS ENGR",
    },
  ];

  const levelOptions = [
    { value: "", label: "Select Level" },
    { value: "200L", label: "200 (LEVEL)" },
    { value: "300L", label: "300 (LEVEL)" },
    { value: "400L", label: "400 (LEVEL)" },
    { value: "500L", label: "500 (LEVEL)" },
  ];

  return (
    <OnboardingLayout>
      <h1 className="text-[#1D1D1D] font-bold text-2xl lg:text-5xl mb-6 text-center">
        Sign Up
      </h1>
      <CustomInput
        name="fullname"
        placeholder="Enter Your Full Name"
        type="text"
        rules={inputRuleNoPattern("fullname")}
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
      <CustomInput
        name="email"
        placeholder="Enter Your Email"
        type="text"
        rules={emailRule}
        control={control}
        errors={errors}
      />
      <CustomButton
        text="Confirm"
        onClick={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </OnboardingLayout>
  );
}

export default StudentSignUp;
