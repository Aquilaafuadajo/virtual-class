import React from "react";
import OnboardingLayout from "../../containers/onboardingLayout";
import CustomButton from "../../components/customButton";

function SignUp() {
  return (
    <OnboardingLayout>
      <h1 className="text-[#1D1D1D] font-bold text-2xl lg:text-5xl mb-3">
        Get started for free
      </h1>
      <p className="text-[#4F4F4F] font-normal text-sm lg:text-lg mb-3">
        Try web-meet for free with no time limit or credit card requirement.
        Upgrade to unlock unlimited feedback submissions if you are happy.
      </p>
      <CustomButton text="Sign-up as a Teacher" isLink to="/sign-up/teacher" />
      <div className="flex items-center justify-around mb-3">
        <hr className="w-[40%]" />
        <p className="text-[#828282]">Or</p>
        <hr className="w-[40%]" />
      </div>
      <CustomButton text="Sign-up as a Student" isLink to="/sign-up/student" />
    </OnboardingLayout>
  );
}

export default SignUp;
