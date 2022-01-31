import CryptoJS from "crypto-js";

export const decodedToken = (token) => {
  if (!token) return null;
  return {
    user: "Emmanuel",
  };
  // const bytes = CryptoJS.AES.decrypt(token, process.env.REACT_APP_TOKEN_KEY);
  // return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export function generateVerificationCode(length = 10) {
  const upperBound = Math.floor(length / 2 + 2);
  return (
    Math.random().toString(36).substring(2, upperBound) +
    Math.random().toString(36).substring(2, upperBound)
  );
}
