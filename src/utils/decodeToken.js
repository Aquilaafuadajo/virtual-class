import CryptoJS from "crypto-js";

const decodedToken = (token) => {
  if (!token) return null;
  return {
    user: "Emmanuel",
  };
  // const bytes = CryptoJS.AES.decrypt(token, process.env.REACT_APP_TOKEN_KEY);
  // return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export default decodedToken;
