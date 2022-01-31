import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

// components
import OnboardingLayout from "../../containers/onboardingLayout";
import CustomButton from "../../components/customButton";
import CustomInput from "../../components/customInput";

// context
import AppContext from "../../contexts/AppContext";

// utils
import { emailRule, inputRuleNoPattern } from "../../utils/validation";

// firebase
import { login, getUser } from "../../firebase/firebase";

function TeacherSignup() {
  const [error, setError] = useState("");
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      email: "",
      code: "",
    },
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, user } = useContext(AppContext);
  const history = useHistory();

  const onConfirm = async (data) => {
    setIsLoading(true);
    await login(
      data,
      ({ code }) => {
        console.log("verification code:", code);
        setVerificationCode(code);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );
  };
  const onFinish = (data) => {
    setIsLoading(true);
    if (data.code === verificationCode) {
      getUser(
        data,
        (user) => {
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          setIsLoading(false);
          if (user?.role === "admin") {
            history.push(`/app/admin/${user?.userId}`);
          } else {
            history.push(`/app/${user.userId}`);
          }
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        }
      );
    } else {
      setError("Invalid code!");
      setIsLoading(false);
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
        disabled={verificationCode}
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
          {error && (
            <p className="text-red-500 font-normal text-sm lg:text-lg text-center mb-3">
              {error}
            </p>
          )}
          {verificationCode && (
            <p className="text-[#27AE60] font-normal text-sm lg:text-lg text-center mb-3">
              Verification code sent to email provided, please check your email.
            </p>
          )}
        </div>
      )}
    </OnboardingLayout>
  );
}

export default TeacherSignup;
