import React, { useState } from "react";
import { useForm } from "react-hook-form";

// components
import OnboardingLayout from "../../../containers/onboardingLayout";
import CustomButton from "../../../components/customButton";
import CustomInput from "../../../components/customInput";
import CustomDropdown from "../../../components/customDropdown";

// hooks
import useQuery from "../../../hooks/useQuery";

// utils
import { emailRule, inputRuleNoPattern } from "../../../utils/validation";

// check route if there's a token
// if token present form, if not present request token form

function TeacherSignup() {
  const query = useQuery();
  const token = query.get("token");

  const RequestToken = () => {
    const { handleSubmit, control, errors } = useForm({
      defaultValues: {
        email: "",
      },
    });
    const onSubmit = (data) => console.log({ data });

    return (
      <OnboardingLayout>
        <h1 className="text-[#1D1D1D] font-bold text-2xl lg:text-5xl mb-6">
          Get started for free
        </h1>
        <p className="text-[#4F4F4F] font-normal text-sm lg:text-lg mb-3">
          Try web-meet for free with no time limit or credit card requirement.
          Upgrade to unlock unlimited feedback submissions if you are happy.
        </p>
        <CustomInput
          name="email"
          placeholder="Enter Your Email e.g name@lasu.edu.ng"
          type="text"
          rules={emailRule}
          control={control}
          errors={errors}
        />
        <CustomButton text="Request token" onClick={handleSubmit(onSubmit)} />
        <p className="text-[#27AE60] font-normal text-sm lg:text-lg text-center mb-3">
          Request sent. Please wait while an admin approves your request.
        </p>
      </OnboardingLayout>
    );
  };

  const SignupForm = () => {
    // decode token here
    // if token expired or invalid, open toast and prompt to request token again
    const { handleSubmit, control, errors } = useForm({
      defaultValues: {
        fullname: "",
        department: "",
        email: "decoded@lasu.edu.ng",
        code: "",
      },
    });
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const onConfirm = (data) => {
      // generate code
      const code = "SVNEOK";
      setVerificationCode(code);
      // search email in DB and update generated code if email not found, openToast(Email not recognized!) return
      // if email found send code to email and save in state. setVerificationCode(code)
      //
      console.log({ data });
    };
    const onFinish = (data) => {
      // compare code locally
      // save data in DB
      if (data.code === verificationCode) {
        console.log({ data });
        // update app context.
      } else {
        // open toast
      }
    };

    const options = [
      { value: "", label: "Select Department" },
      { value: "CPE", label: "CPE" },
      { value: "ECE", label: "ECE" },
      { value: "MECH", label: "MECH" },
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
          options={options}
          rules={inputRuleNoPattern("department")}
          control={control}
          errors={errors}
        />
        <CustomInput
          disabled
          name="email"
          type="text"
          rules={emailRule}
          control={control}
          errors={errors}
        />
        {!verificationCode && (
          <CustomButton
            text="Confirm"
            onClick={handleSubmit(onConfirm)}
            isLoading={isLoading}
          />
        )}
        {verificationCode && (
          <div>
            <CustomInput
              name="code"
              placeholder="Enter Code"
              type="text"
              rules={inputRuleNoPattern("code")}
              control={control}
              errors={errors}
            />
            <CustomButton
              text="Finish"
              onClick={handleSubmit(onFinish)}
              isLoading={isLoading}
            />
          </div>
        )}
      </OnboardingLayout>
    );
  };

  return !token ? <RequestToken /> : <SignupForm />;
}

export default TeacherSignup;
