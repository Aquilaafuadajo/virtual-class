import React, { useState } from "react";
import { useForm } from "react-hook-form";

// components
import OnboardingLayout from "../../containers/onboardingLayout";
import CustomButton from "../../components/customButton";
import CustomInput from "../../components/customInput";

// utils
import { emailRule, inputRuleNoPattern } from "../../utils/validation";

function TeacherSignup() {
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      email: "",
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
    // if email found setVerificationCode(code)
    //
    console.log({ data });
  };
  const onFinish = (data) => {
    // compare code locally
    if (data.code === verificationCode) {
      console.log({ data });
      // update app context.
      // update route history
    } else {
      // open toast
    }
  };

  return (
    <OnboardingLayout>
      <h1 className="text-[#1D1D1D] font-bold text-2xl lg:text-5xl mb-6 text-center">
        Login
      </h1>
      <CustomInput
        name="email"
        placeholder="Enter Your Email"
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
            text="Verify"
            onClick={handleSubmit(onFinish)}
            isLoading={isLoading}
          />
        </div>
      )}
    </OnboardingLayout>
  );
}

export default TeacherSignup;
