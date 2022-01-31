import CryptoJS from "crypto-js";

export const generateToken = (data) => {
  const token = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_JWT_PRIVATE_KEY
  ).toString();
  return token;
};

export const verifyToken = (token, errorCallback) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      token,
      process.env.REACT_APP_JWT_PRIVATE_KEY
    );

    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (err) {
    return errorCallback("Invalid token");
  }
};
