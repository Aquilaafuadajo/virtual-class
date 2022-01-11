import React, { useState } from "react";
import { useForm } from "react-hook-form";

// components
import OnboardingLayout from "../../../containers/onboardingLayout";
import CustomButton from "../../../components/customButton";
import CustomInput from "../../../components/customInput";
import CustomDropdown from "../../../components/customDropdown";

// utils
import { emailRule, inputRuleNoPattern } from "../../../utils/validation";

function TeacherSignup() {
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      fullname: "",
      department: "",
      level: "",
      email: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const onConfirm = (data) => {
    // save data
    console.log({ data });
  };

  const departmentOptions = [
    { value: "", label: "Select Department" },
    { value: "CPE", label: "CPE" },
    { value: "ECE", label: "ECE" },
    { value: "MECH", label: "MECH" },
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
        onClick={handleSubmit(onConfirm)}
        isLoading={isLoading}
      />
    </OnboardingLayout>
  );
}

export default TeacherSignup;
