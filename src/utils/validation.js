/* eslint-disable no-useless-escape */
export const emailRule = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: "Invalid email address",
  },
};

export const inputRuleNoPattern = (name) => ({
  required: `${name} is required`,
});
