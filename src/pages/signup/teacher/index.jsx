import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

// components
import OnboardingLayout from "../../../containers/onboardingLayout";
import CustomButton from "../../../components/customButton";
import CustomInput from "../../../components/customInput";
import CustomDropdown from "../../../components/customDropdown";

// contexts
import AppContext from "../../../contexts/AppContext";

// hooks
import useQuery from "../../../hooks/useQuery";

// utils
import { emailRule, inputRuleNoPattern } from "../../../utils/validation";
import { verifyToken } from "../../../utils/jwt";

// firebase
import {
  signup,
  teacherSignUp,
  confirmTeacherSignUp,
  getUserToken,
} from "../../../service/firebase";

// check route if there's a token
// if token present form, if not present request token form

function TeacherSignup() {
  const query = useQuery();
  const [token, setToken] = useState(query.get("token"));
  const { setUser } = useContext(AppContext);

  const RequestToken = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState(false);
    const [error, setError] = useState("");
    const { handleSubmit, control, errors } = useForm({
      defaultValues: {
        fullname: "",
        email: "",
      },
    });
    const onSubmit = async (data) => {
      setIsLoading(true);
      await signup(
        { ...data, status: "pending" },
        () => {
          setRequestStatus(true);
          setIsLoading(false);
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        }
      );
    };

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
          name="fullname"
          placeholder="Enter Your Full Name"
          type="text"
          rules={inputRuleNoPattern("fullname")}
          control={control}
          errors={errors}
        />
        <CustomInput
          name="email"
          placeholder="Enter Your Email e.g name@lasu.edu.ng"
          type="text"
          rules={emailRule}
          control={control}
          errors={errors}
        />
        <CustomButton
          text="Request token"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
          disabled={requestStatus}
        />
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        {requestStatus && (
          <p className="text-[#27AE60] font-normal text-sm lg:text-lg text-center mb-3">
            Request sent. Please wait while your request is being reviewed by an
            admin. A mail with with a token url will be sent to your mail once
            approved.
          </p>
        )}
      </OnboardingLayout>
    );
  };

  const SignupForm = () => {
    const history = useHistory();
    const [newUser, setNewUser] = useState(
      verifyToken(token.split(" ").join("+"), (error) => {
        alert(error);
        window.location.replace(
          `${window.location.protocol}//${window.location.host}/sign-up/teacher`
        );
      })
    );

    // check token validity
    useEffect(() => {
      const makeRequest = async () => {
        await getUserToken(
          newUser,
          ({ expiresAt, token } = {}) => {
            if (token?.split(" ").join("+") !== token) {
              alert("Invalid token!");
              window.location.replace(
                `${window.location.protocol}//${window.location.host}/sign-up/teacher`
              );
            }
            if (expiresAt < Date.now()) {
              alert("Token expired!");
              window.location.replace(
                `${window.location.protocol}//${window.location.host}/sign-up/teacher`
              );
            }
          },
          (error) => {
            alert(error);
          }
        );
      };
      makeRequest();
    }, []);

    const { handleSubmit, control, errors } = useForm({
      defaultValues: {
        fullname: newUser?.fullname,
        department: "",
        email: newUser?.email,
        code: "",
      },
    });
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const onConfirm = async (data) => {
      setError("");
      setIsLoading(true);
      await teacherSignUp(
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
      setError("");
      setIsLoading(true);
      if (data.code === verificationCode) {
        confirmTeacherSignUp(
          data,
          (user) => {
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            setIsLoading(false);
            history.push(`/app/${user.userId}`);
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
          disabled
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
          disabled
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
        {error && (
          <p className="text-red-500 font-normal text-sm lg:text-lg text-center mb-3">
            {error}
          </p>
        )}
      </OnboardingLayout>
    );
  };

  return !token ? <RequestToken /> : <SignupForm />;
}

export default TeacherSignup;
